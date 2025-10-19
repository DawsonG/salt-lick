import { describe, expect, it } from "vitest";
import DscriptParser from "./DscriptParser";

describe('DscriptParser', () => {
    const passageWithState = {
        textContent: `
playerCharacter = "bob"
number = 20
number += 5
number -= 20
number *= 2
VisualNovel {
    background: "./img/anImage.jpg"
}
`,
        pid: 1,
        name: 'passageWithState'
    };

    const parser = new DscriptParser();
    
    it('should work, plz', () => {
        const tokens = [...parser.parse(passageWithState.textContent)];
        expect(tokens).toStrictEqual([
            {
                index: expect.any(Number),
                type: 'line-break',
            },
            { 
                index: expect.any(Number),
                type: 'assignment',
                value: {
                    variableName: 'playerCharacter',
                    variableOperator: '=',
                    variableValue: 'bob',
                }
            },
            {
                index: expect.any(Number),
                type: 'assignment',
                value: {
                    variableName: 'number',
                    variableOperator: '=',
                    variableValue: 20,
                }, 
            },
            {
                index: expect.any(Number),
                type: 'assignment',
                value: {
                    variableName: 'number',
                    variableOperator: '+=',
                    variableValue: 5,
                }, 
            },
            {
                index: expect.any(Number),
                type: 'assignment',
                value: {
                    variableName: 'number',
                    variableOperator: '-=',
                    variableValue: 20,
                }
            },
            {
                index: expect.any(Number),
                type: 'assignment',
                value: {
                    variableName: 'number',
                    variableOperator: '*=',
                    variableValue: 2,
                }
            },
            {
                index: expect.any(Number),
                type: 'reading-configuration',
                value: {
                    keyword: 'VisualNovel'
                }
            },
            {
                index: expect.any(Number),
                type: 'line-break'
            }
        ]);
    });
});