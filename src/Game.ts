import markedParse from "./marked";
import { loadPassage } from "./utils/passages";
import { isWrappedInQuotes, parseOutQuotes } from "./utils/stringManipulation";
import { type IPassage } from "./utils/tagHandlers";
import { isNumber } from "./utils/types";

export type ParsingPath = 'VisualNovel' | 'Battle' | 'Normal';

export default class Game {
    private _state: Record<string, any>;
    private _history: IPassage[];
    private _historyIndex: number;
    private readonly _startingPoint: number;
    private readonly _container: HTMLDivElement;
    
    constructor(startingPoint?: number) {
        this._state = {};
        this._history = [];
        this._historyIndex = -1;
        this._startingPoint = startingPoint || 0;
        this._container = document.getElementById('container')! as HTMLDivElement;

        if (startingPoint) {
            const passage = loadPassage(this._startingPoint);
            this.render(passage);
        }
    }

    public goBack() {
        const last = this._history.pop();
        if (!last) { // history is empty
            return; // do nothing
        }

        this.render(last);
    }

    public goForward() {

    }

    public goto(passageName: string | number) {
        const passage = loadPassage(passageName);
        this.render(passage);
    }

    public get state() {
        return this._state;
    }

    public async render(passage: IPassage) {
        this._history.push(passage); // store the latest passage
    
        let textContent = passage.textContent;
        // Run variable updates.
        if (textContent.indexOf('\n--\n') !== -1) {
            const textParts = textContent.split('\n--\n');
            this.parseState(textParts[0]);
            textContent = textParts[1];
        }

        // Process markdown
        textContent = this.parseText(textContent);
        const html = await markedParse(textContent);

        // clean out container
        this._container.innerHTML = html;

        this.attachEventListeners();
    }

    /** -----------------------------------
     * Private and Static Utility functions
     */

    private parseState(src: string): ParsingPath {
        let rtn: ParsingPath = 'Normal'; // How to parse the rest of the passage
        let readIndex = 0; // Stores the 

        for (const line of src.split(/\r?\n|\r/)) {
            if (line.trim() === '') continue;
            if (line.startsWith('VisualNovel')) {
                rtn = 'VisualNovel';
                // grab from { to }
                const startIndex = src.indexOf('{');
                const endIndex = src.indexOf('}');
            }

            
            const parts = line.split(/([+\-*=/]{1,2})/);
            const name = parts[0].trim();
            const op = parts[1].trim();
            const value = parts[2].trim();

            switch(op) {
                case "=":
                    if (isWrappedInQuotes(value)) {
                        // Treat as string
                        this._state[name] = parseOutQuotes(value);
                    } else {
                        // Treat as number
                        this._state[name] = parseFloat(value);
                    }
                    break;
                case "+=":
                    if (isNumber(value)) {
                        this._state[name] = (this._state[name] || 0) + parseFloat(value);
                    } else {
                        throw new Error(`${name} is not a number. Cannot add ${value}`);
                    }
                    break;
                case "-=":
                    if (isNumber(value)) {
                        this._state[name] = (this._state[name] || 0) - parseFloat(value);
                    } else {
                        throw new Error(`${name} is not a number. Cannot subtract ${value}`);
                    }
                    break;
                case "*=":
                    if (isNumber(value)) {
                        this._state[name] = this._state[name] * parseFloat(value);
                    } else {
                        throw new Error(`${name} is not a number. Cannot multiply ${value}`);
                    }
                    break;
                default:
                    throw new Error(`${op} not recognized`);
            }
        }

        return rtn;
    }

    private parseText(src: string): string {
        return src.replace(/{{(\w+)}}/g, (_, match) => `${this._state[match]}`);
    }

    private attachEventListeners() {
        // Overwrite event handling for some objects
        document.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
            e.preventDefault();
            this.goto(a.getAttribute('data-passage') || '');
        }));
    }
}