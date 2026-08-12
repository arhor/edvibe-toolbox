function createOperationGuard() {
    let activeOperation = null;

    return {
        canStart() {
            return activeOperation === null;
        },
        activate(operationName) {
            if (activeOperation !== null) {
                return false;
            }

            activeOperation = operationName;
            return true;
        },
        release(operationName) {
            if (activeOperation !== operationName) {
                return false;
            }

            activeOperation = null;
            return true;
        },
        getActiveOperation() {
            return activeOperation;
        }
    };
}

export { createOperationGuard };
