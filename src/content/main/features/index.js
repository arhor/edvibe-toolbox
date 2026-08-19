import { actionRecorderFeatureDefinition } from '#src/content/main/features/action-recorder/action-recorder.js';
import { batchLessonAccessFeatureDefinition } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history.js';
import { batchSectionCreationFeatureDefinition } from '#src/content/main/features/batch-section-creation/batch-section-creation.js';
import { batchSectionDeletionFeatureDefinition } from '#src/content/main/features/batch-section-deletion/batch-section-deletion-history.js';
import { batchUserManagementFeatureDefinition } from '#src/content/main/features/batch-user-management/batch-user-management.js';
import { batchUserOnboardingFeatureDefinition } from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding.js';
import { executionHistoryFeatureDefinition } from '#src/content/main/features/execution-history/execution-history.js';
import { marathonExportFeatureDefinition } from '#src/content/main/features/marathon-export/marathon-export.js';
import { resetLessonsFeatureDefinition } from '#src/content/main/features/reset-lessons/reset-lessons.js';
import { videoAttachmentFeatureDefinition } from '#src/content/main/features/video-attachment/video-attachment.js';

export default [
    actionRecorderFeatureDefinition,
    batchLessonAccessFeatureDefinition,
    batchSectionCreationFeatureDefinition,
    batchSectionDeletionFeatureDefinition,
    batchUserManagementFeatureDefinition,
    batchUserOnboardingFeatureDefinition,
    executionHistoryFeatureDefinition,
    marathonExportFeatureDefinition,
    resetLessonsFeatureDefinition,
    videoAttachmentFeatureDefinition,
];