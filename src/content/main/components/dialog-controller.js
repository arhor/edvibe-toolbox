export class DialogController {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        this.previouslyFocused = null;
        this.initialFocusApplied = false;
        this.handleKeydown = this.handleKeydown.bind(this);
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
        if (this.initialFocusApplied) return;
        const target = this.resolveInitialFocus();
        if (!target) return;
        target.focus();
        this.initialFocusApplied = true;
    }

    hostDisconnected() {
        this.document?.removeEventListener('keydown', this.handleKeydown);
        if (this.previouslyFocused?.isConnected) this.previouslyFocused.focus();
        this.previouslyFocused = null;
        this.initialFocusApplied = false;
    }

    resolveInitialFocus() {
        const root = this.host.renderRoot;
        const configured = typeof this.options.initialFocus === 'function'
            ? this.options.initialFocus(this.host)
            : root?.querySelector(this.options.initialFocus || '[autofocus]');
        return configured || root?.querySelector(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
    }

    handleKeydown(event) {
        if (event.key !== 'Escape' || event.defaultPrevented) return;
        if (this.options.canClose && !this.options.canClose(this.host)) return;
        const close = this.options.onClose;
        if (typeof close !== 'function') return;
        event.preventDefault();
        close(this.host, event);
    }
}
