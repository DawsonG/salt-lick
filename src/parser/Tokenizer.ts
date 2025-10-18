export const END = Symbol("END");

export type Token = {
    index: number,
    type: string | null,
    value?: string,
};

type TokenType = {
    matcher: RegExp,
    type: string | null,
    valueExtractor?: (arg: string) => string,
};

export class Tokenizer {
    private readonly tokenTypes: TokenType[];

    constructor(tokenTypes: TokenType[]) {
        this.tokenTypes = tokenTypes;
    }

    *tokenize(text: string) {
        let index = 0;
        while (index < text.length) {
            let hasMatch = false;

            for (const { matcher, type, valueExtractor } of this.tokenTypes) {
                const currentMatcher = new RegExp(matcher.source, "y");
                currentMatcher.lastIndex = index;
                const matched = currentMatcher.exec(text);
                if (matched !== null) {
                    index += matched[0].length;
                    if(type != null) {
                        const token: Token = { 
                            type,
                            index
                        };
                        if (valueExtractor){
                            token.value = valueExtractor(matched[0]);
                        }
                        yield token;
                    }
                    hasMatch = true;
                }
            }
            if (!hasMatch) {
                throw new Error(`Unexpected token at index ${index}`);
            }
        }
        yield { type: END };
    }
}