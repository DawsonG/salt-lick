import { isWrappedInQuotes, parseOutQuotes } from "../utils/stringManipulation";
import { keywords } from "./keywords";

export type Command = {
    matcher: string | RegExp,
    type: string,
    matcherFlags?: string,
    valueExtractor?: (match: RegExpMatchArray) => Record<string, any>;
};

export type Token = {
    index: number,
    type: string,
    value?: Record<string, any>,
};

export default class DscriptParser {
    private readonly _commandTypes: Command[];

    constructor(commandTypes?: Command[]) {
        this._commandTypes = [
            { matcher: /[ \t]+/, type: 'whitespace' },
            { matcher: /\r?\n/, type: 'line-break' },
            {
                matcher: /([a-zA-Z_\d]+)( ?[+\-*]?= ?)(\"?.+\"?)[;|\n]?/g,
                type: 'assignment',
                valueExtractor: match => ({
                    variableName: match[1],
                    variableOperator: match[2].trim(),
                    variableValue: DscriptParser.parseAssignment(match[3])
                }),
            },
            {
                matcher: `(${Array.from(keywords.keys()).join('|')})\\s?(\\{(.*?)\\n?\\})?`,
                matcherFlags: 's',
                type: 'reading-configuration',
                valueExtractor: match => ({
                    keyword: match[1],

                }),
            },
            ...(commandTypes || []),
        ];
    }

    *parse(text: string) {
        let index = 0;
        while (index < text.length) {
            let hasMatch = false;
            
            for (const { matcher, matcherFlags, type, valueExtractor } of this._commandTypes) {
                const currentMatcher =
                    new RegExp(typeof(matcher) === 'string' ? matcher : matcher.source, `y${matcherFlags || ''}`);
                currentMatcher.lastIndex = index;
                const matched = currentMatcher.exec(text);
                if (matched !== null) {
                    index += matched[0].length;
                    if(type != null) {
                        const token: Token = { 
                            type,
                            index
                        };

                        if (valueExtractor) {
                            token.value = valueExtractor(matched);
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

        return { type: 'end' };
    }

    /**
     * parseAssignemnt
     * @param value 
     * @returns the value of the assignment, coerced into the correct type
     */
    private static parseAssignment(value: string): string | number {
        if (isWrappedInQuotes(value)) {
            // Treat as string
            return parseOutQuotes(value);
        } else {
            // Treat as number
            return parseFloat(value);
        }
    }
}