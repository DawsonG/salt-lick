import markedParse from "./marked";
import DscriptParser, { type Token } from "./parser/DscriptParser";
import { loadPassage } from "./utils/passages";
import { isWrappedInQuotes, parseOutQuotes } from "./utils/stringManipulation";
import { type IPassage } from "./utils/tagHandlers";
import { isNumber } from "./utils/types";

export type ParsingPath = 'VisualNovel' | 'Battle' | 'Normal';

export default class Game {
    private _state: Record<string, any>;
    private _history: IPassage[];
    private _historyIndex: number;
    private readonly _parser: DscriptParser;
    private readonly _startingPoint: number;
    private readonly _container: HTMLDivElement;
    
    constructor(startingPoint?: number) {
        this._state = {};
        this._history = [];
        this._historyIndex = -1;
        this._startingPoint = startingPoint || 0;
        this._container = document.getElementById('container')! as HTMLDivElement;
        this._parser = new DscriptParser();

        if (startingPoint) {
            const passage = loadPassage(this._startingPoint);
            this.render(passage);
        }

        this.attachGlobalEventListeners();
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
        
        const tokens = [...this._parser.parse(src)];
        for (const t of tokens) {
            if (['whitespace', 'line-break'].includes(t.type)) {
                continue;
            }

            switch(t.type) {
                case 'assignment':
                    this.processAssignment(t);
                    break;
                case 'reading-configuration':
                    rtn = t.value!.keyword;
                    break;
            }
        }

        return rtn;
    }

    private parseText(src: string): string {
        return src.replace(/{{(\w+)}}/g, (_, match) => `${this._state[match]}`);
    }

    private processAssignment(token: Token) {
        const { variableName, variableOperator, variableValue } = token.value!;
        switch (variableOperator) {
            case '=':
                this._state[variableName] = variableValue;
                break;
            case '+=':
                this._state[variableName] = (this._state[variableName] || 0) + variableValue;
                break;
            case '-=':
                this._state[variableName] = (this._state[variableName] || 0) - variableValue;
                break;
            case '*=':
                this._state[variableName] = (this._state[variableName] || 0) * variableValue;
                break;
            default:
                throw new Error(`Operator ${variableOperator} is not recognized.`);
        }
    }

    private attachGlobalEventListeners() {
        const self = this;
        document.addEventListener('variable-change-event', function(event) {
            self._state[(event as any).detail!.variableName] = 
                (event as any).detail!.variableValue;
        });
    }

    private attachEventListeners() {
        // Overwrite event handling for some objects
        document.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
            e.preventDefault();
            this.goto(a.getAttribute('data-passage') || '');
        }));
    }
}