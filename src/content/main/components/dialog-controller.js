export class DialogController {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        this.previouslyFocused = null;
        this.initialFocusApplied = false;
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        host.addController(this);
    }

    get document() {
        return this.host.ownerDocument;
    }

    hostConnected() {
        this.previouslyFocused = this.document?.activeElement || null;
        this.document?.addEventListener('keydown', this.handleKeydown);
    }

    hostUpdated() {
        if (this.initialFocusApplied) {
            return;
        }
        const target = this.resolveInitialFocus();
        if (!target) {
            return;
        }
        target.focus();
        this.initialFocusApplied = this.hasFocus(target);
    }

    hostDisconnected() {
        this.document?.removeEventListener('keydown', this.handleKeydown);
        if (this.previouslyFocused?.isConnected) {
            this.previouslyFocused.focus();
        }
        this.previouslyFocused = null;
        this.initialFocusApplied = false;
    }

    resolveInitialFocus() {
        const root = this.host.renderRoot;
        const configured = typeof this.options.initialFocus === 'function'
            ? this.options.initialFocus(this.host)
            : root?.querySelector(this.options.initialFocus || '[autofocus]');
        if (this.isAvailableFocusTarget(configured)) {
            return configured;
        }
        const candidates = root?.querySelectorAll(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        ) || [];
        return [...candidates].find((candidate) => this.isAvailableFocusTarget(candidate)) || null;
    }

    isAvailableFocusTarget(target) {
        return Boolean(
            typeof target?.focus === 'function'
            && !target.closest?.('[hidden], [inert]')
        );
    }

    hasFocus(target) {
        const root = target.getRootNode?.() || this.host.renderRoot;
        return root?.activeElement === target || this.document?.activeElement === target;
    }

    requestClose(reason, event) {
        if (event?.defaultPrevented) {
            return false;
        }
        if (this.options.canClose && !this.options.canClose(this.host, reason, event)) {
            return false;
        }
        const close = this.options.onClose;
        if (typeof close !== 'function') {
            return false;
        }
        event?.preventDefault?.();
        close(this.host, reason, event);
        return true;
    }

    handleBackdropClick(event) {
        if (event.target !== event.currentTarget) {
            return false;
        }
        return this.requestClose('backdrop', event);
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            this.requestClose('escape', event);
        }
    }
}
