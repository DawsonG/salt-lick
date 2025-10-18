import { type Token, type TokenizerAndRendererExtension  } from "marked";

type OptionListToken = Token & {
    type: 'option-list';
    options: string[];
}

type TwineLinkToken = Token & {
	type: `twine-link`;
	innerText: Token[];
	passage: string;
}

type TranscludeToken = Token & {
    type: 'transclude';
    passageName: string;
}

export const twineLink: TokenizerAndRendererExtension  = {
    name: 'twine-link',
    level: 'inline',
    start(src: string) { return src.match(/\[\[/)?.index; },
    tokenizer(src: string, _tokens: any): TwineLinkToken | undefined {
        const dividerSymbol = '->';
        const rule = /^\[\[(.*?)\]\]/;
        const match = rule.exec(src);
        if (match) {
            const innerds = match[1];
            const dividerIndex = innerds.indexOf(dividerSymbol);
            if (dividerIndex === -1) {
                // This link displays the text that matches the title of the passage
                return {
                    type: 'twine-link',
                    raw: match[0],
                    innerText: this.lexer.inlineTokens(innerds),
                    passage: innerds,
                };
            }

            return {
                type: 'twine-link',
                raw: match[0],
                innerText: this.lexer.inlineTokens(innerds.substring(0, dividerIndex)),
                passage: innerds.substring(dividerIndex+2)
            };
        }
    },
    renderer(token: any) {
        token = token as TwineLinkToken;
        return `<a href="#" data-passage="${token.passage}">${this.parser.parseInline(token.innerText)}</a>`;
    },
};

// Renders a list of selectable options
export const optionList: TokenizerAndRendererExtension = {
    name: 'option-list',
    level: 'inline',
    start(src: string) { src.match(/\[option\-list\:/)?.index },
    tokenizer(src: string, _tokens: any): OptionListToken | undefined {
        const rule = /^\[option\-list\: (.*?)\]/;
        const match = rule.exec(src);
        if (match) {
            const options = match[1].trim().split(',').map(o => o.trim());

            return {
                type: 'option-list',
                raw: match[0],
                options,
            }
        }
    },
    renderer(token: any) {
        return `<option-list options='${JSON.stringify(token.options)}' />`;
    },
};

export const transclude: TokenizerAndRendererExtension = {
    name: 'transclude',
    level: 'block',
    start(src: string) { src.match(/\[transclude\:/)?.index },
    tokenizer(src: string, _tokens: any): TranscludeToken | undefined {
        const rule = /^\[transclude\: (.*?)\]/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: 'transclude',
                raw: match[0],
                passageName: match[1],
            };
        }
    },
    renderer(token: any) {
        return `<transclude-passage passage-name="${token.passageName}" />`;
    }
}