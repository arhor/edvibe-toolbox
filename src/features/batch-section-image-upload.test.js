const test = require('node:test');
const assert = require('node:assert/strict');

const {
    UPLOAD_ENDPOINT,
    createAuthorizationCapture,
    createDynamicImageRecipe,
    uploadImageAssets
} = require('./batch-section-image-upload.js');

class FakeFormData {
    constructor() {
        this.entries = [];
    }

    append(name, value, filename) {
        this.entries.push({ name, value, filename });
    }
}

test('recipe resolves uploaded image assets instead of a recorded fixed banner', () => {
    const recipe = {
        version: 1,
        reviewedDynamicFields: true,
        steps: [{
            id: 'save-image',
            valueTemplate: {
                ExerciseView: {
                    ChangeExerciseImages: [{ ImageId: 123 }]
                }
            }
        }]
    };

    const patched = createDynamicImageRecipe(recipe);
    const image = patched.steps[0].valueTemplate.ExerciseView.ChangeExerciseImages[0];

    assert.deepEqual(image, {
        ImageId: '{{block.asset.imageId}}',
        FullImageId: '{{block.asset.fullImageId}}',
        ImageUrl: '{{block.asset.imageUrl}}',
        FullImageUrl: '{{block.asset.fullImageUrl}}',
        cropped: false
    });
    assert.equal(recipe.steps[0].valueTemplate.ExerciseView.ChangeExerciseImages[0].ImageId, 123);
});

test('selected images are uploaded once as multipart data and mapped by OldId', async () => {
    const file = { name: 'banner.png', type: 'image/png', size: 4096 };
    const registry = {
        get: (clientId) => clientId === 'client-image-1' ? file : null
    };
    const definition = {
        name: 'Announcement',
        blocks: [{
            id: 'block-1',
            type: 'image',
            url: 'https://media-files-y.edvibe.com/local-upload/client-image-1',
            alt: 'Banner'
        }]
    };
    let request = null;
    const fetchFn = async (url, init) => {
        request = { url, init };
        return {
            ok: true,
            status: 200,
            async json() {
                return {
                    IsSuccess: true,
                    Data: {
                        Items: [{
                            IdFull: 687940561,
                            UrlFull: 'https://media-y.edvibe.com/full.png',
                            Id: 687940559,
                            Url: 'https://media-y.edvibe.com/image.png',
                            OldId: 'client-image-1'
                        }],
                        ErrorItems: []
                    }
                };
            }
        };
    };

    const enriched = await uploadImageAssets({
        definition,
        registry,
        authorization: 'session-token',
        fetchFn,
        FormDataCtor: FakeFormData
    });

    assert.equal(request.url, UPLOAD_ENDPOINT);
    assert.equal(request.init.method, 'POST');
    assert.equal(request.init.credentials, 'include');
    assert.equal(request.init.headers.authorization, 'session-token');
    assert.equal(request.init.headers['content-type'], undefined);
    assert.deepEqual(
        request.init.body.entries.map(({ name }) => name),
        [
            'Type',
            'SaveOriginal',
            'IsOriginalSizeOutputImage',
            'Files[0]',
            'Selections[0].X',
            'Selections[0].Y',
            'Selections[0].Width',
            'Selections[0].Height',
            'Ids[0]'
        ]
    );
    assert.deepEqual(enriched.blocks[0].asset, {
        imageId: 687940559,
        fullImageId: 687940561,
        imageUrl: 'https://media-y.edvibe.com/image.png',
        fullImageUrl: 'https://media-y.edvibe.com/full.png'
    });
});

test('authorization is captured only from trusted Edvibe requests', async () => {
    const calls = [];
    const root = {
        location: { href: 'https://edvibe.com/cabinet' },
        Headers,
        fetch: async (...args) => {
            calls.push(args);
            return { ok: true };
        }
    };
    const capture = createAuthorizationCapture(root);

    await root.fetch('https://example.com/api', {
        headers: { authorization: 'outside-token' }
    });
    assert.equal(capture.getAuthorization(), '');

    await root.fetch('https://media-files-y.edvibe.com/api/test', {
        headers: { authorization: 'edvibe-token' }
    });
    assert.equal(capture.getAuthorization(), 'edvibe-token');
    assert.equal(calls.length, 2);
});
