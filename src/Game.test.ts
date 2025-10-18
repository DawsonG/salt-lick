import { describe, expect, it } from 'vitest';

import type { IPassage } from './utils/tagHandlers';
import Game from './Game';

describe('Game', () => {
    const passageWithState: IPassage = {
        textContent: `
playerCharacter = "bob"
number = 20
number += 5
number -= 20
number *= 2
--
Hello {{playerCharacter}},
How are you today?
`,
        pid: 1,
        name: 'passageWithState'
    };

    const div = document.createElement('div');
    div.id = 'container';
    document.body.appendChild(div);

    it('should parse state variables at the start of a passage', async () => {
        const game = new Game();

        await game.render(passageWithState);

        expect(game.state.playerCharacter).toBe('bob');
        expect(game.state.number).toBe(10);
        expect(document.getElementById('container')?.innerHTML).toBe(`<p>Hello bob,
How are you today?</p>
`);
    });
});