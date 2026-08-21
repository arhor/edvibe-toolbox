function createBrowserJsonDownloader(options = {}) {
    const documentApi = options.document;
    const URLApi = options.URL;
    const BlobClass = options.Blob;
    if (!documentApi?.createElement || !URLApi?.createObjectURL || !BlobClass) {
        return Object.freeze({
            download() {
                throw new Error('Browser download APIs are unavailable');
            }
        });
    }
    return Object.freeze({
        download({ filename, json }) {
            const blob = new BlobClass([json], { type: 'application/json;charset=utf-8' });
            const url = URLApi.createObjectURL(blob);
            const anchor = documentApi.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            anchor.hidden = true;
            (documentApi.body || documentApi.documentElement).append(anchor);
            try {
                anchor.click();
            } finally {
                anchor.remove();
                URLApi.revokeObjectURL(url);
            }
        }
    });
}

export { createBrowserJsonDownloader };
