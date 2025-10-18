import { describe, expect, it } from "vitest";
import { END, Tokenizer } from "./Tokenizer";

describe('Tokenizer', () => {
    const javascriptTokenizer = new Tokenizer([
        { matcher: /[ \t]+/, type: null },
        { matcher: /\r?\n/, type: "line-break" },
        { matcher: /{/, type: "{" },
        { matcher: /}/, type: "}" },
        { matcher: /"[^"\r\n]+"/, type: "string-literal", valueExtractor: match => match.slice(1, -1) },
    ]);

    describe('Javascript (test) tokenizer', () => {
        it('should parse spaces', () => {
            const tokens = [...javascriptTokenizer.tokenize(`  `)];
            expect(tokens).toStrictEqual([{ type: END }]);
        });

        it('should parse left curly brace', () => {
            const tokens = [...javascriptTokenizer.tokenize(`{`)];
            expect(tokens).toStrictEqual([
                { type: '{', index: 1},
                { type: END }
            ]);
        });

        it('should parse strings (with double quotes)', () => {
            const tokens = [...javascriptTokenizer.tokenize(`"foo"`)];
            expect(tokens).toStrictEqual([
                { type: "string-literal", value: `foo`, index: 5 },
                { type: END }]);
            });
    });

    const dscriptTokenizer = new Tokenizer([
        {
            matcher: /([a-zA-Z_\d]+)( ?[+\-*]?= ?)(\"?.+\"?)[;|\n]?/,
            type: 'assignment',
            valueExtractor: match => `${match[1]}|${match[3]}`
        },
    ]);

    describe('DscriptTokenizer', () => {
        it('should parse variable assignments', () => {
            const tokens = [...dscriptTokenizer.tokenize('playerCharacter = "bob"')];
            expect(tokens).toStrictEqual({ type: 'assignment', value: 'playerCharacter|"bob"' });
        });
    });
});