import type { Token, Tokenizer } from "./Tokenizer";

type Production = {
    failed: boolean,
    type: string,
    children?: any,
    length: number,
};

export function nonterminal(type: string) {
    return { type: 'nonterminal', matcher: type };
}

export default class Parser {
    private readonly tokenizer;
    private readonly productions;
    private readonly goalProduction;

    constructor(tokenizer: Tokenizer, productions: any, goalProduction: any) {
        this.tokenizer = tokenizer;
        this.productions = productions;
        this.goalProduction = goalProduction;

        if (!this.productions[goalProduction]) 
            throw new Error(`Goal production ${goalProduction} did not exist.`);
    }

    parse(text: string) {
        const tokens = this.tokenizer.tokenize(text);
        const production = this.produce(tokens, this.goalProduction, this.productions[this.goalProduction]);
        if (production.failed) {
            throw new Error(`Syntax error`);
        }

        return {
            type: production.type,
            children: production.children,
        }
    }

    produce(tokens: any, productionType: string, productionRules: any, startIndex = 0): Production {
        for (const rule of productionRules) {
            const match = this.matchRule(tokens, rule, startIndex);

            if (!match.failed) {
                return {
                    failed: false,
                    type: productionType,
                    children: match.matches,
                    length: match.length,
                }
            }
        }

        return { failed: true, type: '', length: 0 };
    }

    matchRule(tokens: Token[], rule: any, startIndex: number) {
        const matches = [];
        let offset = 0;

        for (const part of rule) {
            if (typeof(part) === 'string') {
                if (tokens[startIndex + offset].type === part) {
                    matches.push(tokens[startIndex + offset]);
                    offset++;
                } else {
                    return { length: offset, failed: true };
                }
            } else if (part.type === 'nonterminal') {
                if (!this.productions[part.matcher]) {
                    throw new Error(`Nonterminal production ${part.matcher} did not exist.`);
                }

                const production = this.produce(
                    tokens, part.matcher, this.productions[part.matcher], startIndex + offset
                );

                if (!production.failed) {
                    matches.push({ type: production.type, children: production.children });
                    offset += production.length
                } else {
                    return { length: offset, failed: true };
                }
            }
        }

        return {
            failed: false,
            length: offset,
            matches
        };
    }
}