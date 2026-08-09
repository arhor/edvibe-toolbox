import type { ChromeStorageBridge } from './chrome-storage-bridge.types.js';
import type {
    EdvibeMarathonApi,
    EdvibeSendRequest,
    MarathonPupil
} from './edvibe-marathon-api.types.js';
import type {
    ExecutionHistoryRepository,
    ExecutionRecord,
    ExecutionRecordInput
} from './execution-history.types.js';
import type {
    MainCommandMessage,
    StorageRequestMessage
} from './message-protocol.types.js';

const sendRequest: EdvibeSendRequest = async (_controller, _method, _project, value) => ({
    Value: value
});
void sendRequest;

declare const edvibeApi: EdvibeMarathonApi;
const pupils: Promise<MarathonPupil[]> = edvibeApi.loadAllPupils({ marathonId: 18508, pageSize: 50 });
void pupils;
// @ts-expect-error marathon identifiers must be numeric at the API boundary
edvibeApi.loadAllPupils({ marathonId: '18508' });
// @ts-expect-error lesson reads require an explicit lesson identifier
edvibeApi.getLessonById({});

declare const storage: ChromeStorageBridge;
const preferences = storage.get('executionHistoryPreferences');
void preferences;
storage.set('executionHistoryPreferences', { maxCount: 100, maxAgeDays: 30 });
// @ts-expect-error arbitrary extension storage keys are outside the validated protocol
storage.get('exportInProgress');
// @ts-expect-error persistence preferences do not accept unrelated fields
storage.set('executionHistoryPreferences', { token: 'secret' });

const mainCommand: MainCommandMessage = { type: 'EDVIBE_TOOLBOX_OPEN_RESET' };
void mainCommand;
const storageRequest: StorageRequestMessage = {
    type: 'EDVIBE_TOOLBOX_STORAGE_REQUEST',
    requestId: 'request-1',
    action: 'get',
    key: 'executionHistoryPreferences'
};
void storageRequest;
// @ts-expect-error storage get requests cannot smuggle a value payload
const invalidStorageRequest: StorageRequestMessage = {
    type: 'EDVIBE_TOOLBOX_STORAGE_REQUEST',
    requestId: 'request-2',
    action: 'get',
    key: 'executionHistoryPreferences',
    value: { maxCount: 1 }
};
void invalidStorageRequest;

declare const historyRepository: ExecutionHistoryRepository;
declare const record: ExecutionRecord;
const persisted: Promise<ExecutionRecord> = historyRepository.persist(record);
void persisted;
historyRepository.list({ status: 'completed', marathonId: 18508 });
// @ts-expect-error history filters only accept terminal statuses
historyRepository.list({ status: 'running' });

const historyInput: ExecutionRecordInput = {
    operationType: 'batch-section-deletion',
    startedAt: new Date(),
    status: 'completed_with_failures',
    counts: { requested: 2, eligible: 2, attempted: 2, successful: 1, failed: 1 },
    results: [{
        status: 'failed',
        code: 'SERVER_REJECTED',
        message: 'Rejected by Edvibe',
        data: { lessonId: 42 }
    }]
};
void historyInput;
// @ts-expect-error untrusted/raw transport material is not part of the persisted JSON contract
const invalidHistoryInput: ExecutionRecordInput = {
    operationType: 'example',
    startedAt: new Date(),
    status: 'completed',
    results: [{
        status: 'completed',
        code: 'OK',
        message: 'done',
        data: { socket: new WebSocket('wss://example.invalid') }
    }]
};
void invalidHistoryInput;
