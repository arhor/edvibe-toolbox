export class OperationGuard {
    constructor() {
        this.activeOperation = null;

        this.canStart = this.canStart.bind(this);
        this.activate = this.activate.bind(this);
        this.release = this.release.bind(this);
        this.guardedActiveChange = this.guardedActiveChange.bind(this);
    }

    canStart() {
        return this.activeOperation === null;
    }

    activate(operationName) {
        if (this.activeOperation !== null) {
            return false;
        }

        this.activeOperation = operationName;
        return true;
    }

    release(operationName) {
        if (this.activeOperation !== operationName) {
            return false;
        }

        this.activeOperation = null;
        return true;
    }

    guardedActiveChange(key) {
        return (isActive) => {
            if (isActive) {
                this.activate(key);
            } else {
                this.release(key);
            }
        };
    }
}
