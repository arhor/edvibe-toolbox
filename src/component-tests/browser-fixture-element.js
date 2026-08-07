class BrowserFixtureElement extends HTMLElement {
    static observedAttributes = ['label'];

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    render() {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = this.getAttribute('label') || 'Run';
        this.shadowRoot.replaceChildren(button);
    }
}

if (!customElements.get('browser-fixture-element')) {
    customElements.define('browser-fixture-element', BrowserFixtureElement);
}
