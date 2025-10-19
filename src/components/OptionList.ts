export default class OptionList extends HTMLElement {
    private variable?: string;
    private selectedOption?: string;
    private options: string[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['variable', 'selected-option', 'options'];
    }

    connectedCallback() {
        this.render();

        console.log('connectedCallback', this.getAttribute('variable'));
        this.addEventListeners();
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === 'options') {
            this.options = JSON.parse(newValue);
            this.render();

            console.log(this.dataset.variable);
            if (this.variable) {
                console.log('emit', this.variable);
                document.dispatchEvent(new CustomEvent('variable-change-event', {
                    bubbles: false,
                    cancelable: false,
                    detail: {
                        variableName: this.variable,
                        variableValue: newValue
                    }
                }));
            }
        } else if (['variable'].includes(name)) {
            (this as any)[name] = newValue;
        }
    }

    private render() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                .option {
                    cursor: pointer;
                    color: blue;
                    text-decoration: underline;
                    margin: 0 5px;
                }
            </style>
            ${this.options.map(option => {
                if (option === this.selectedOption) {
                    return option;
                }
                return `<span class="option" data-value="${option}">${option}</span>`;
            }).join(' | ')}
        `;
    }

    private addEventListeners() {
        this.shadowRoot?.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('option')) {
                const value = target.dataset.value;
                const event = new CustomEvent('option-selected', {
                    detail: { value },
                    bubbles: true,
                    composed: true
                });
                this.dispatchEvent(event);

                this.selectedOption = value;
                this.render();
            }
        });
    }
}