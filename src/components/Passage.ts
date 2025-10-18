import markedParse from "../marked";
import { loadPassage } from "../utils/passages";

export default class Passage extends HTMLElement {
    private passageName?: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['passage-name'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name === 'passage-name') {
            this.passageName = newValue;
            this.render();
        }
    }

    private async render() {
        if (!this.shadowRoot) return;

        if (!this.passageName) {
            throw new Error(`No passageName passed into <transclude-passage /> tag`);
        }
        const passage = loadPassage(this.passageName);
        this.shadowRoot.innerHTML = await markedParse(passage.textContent);
    }
}