import { describe, it, expect } from 'vitest';
import { createGameState } from '../assets/scripts/core/gameState';

const level = { targetIds: ['a', 'b'], hearts: 3, hints: 1 };

describe('game state', () => {
  it('marks targets found and wins when all found', () => {
    const state = createGameState(level);
    state.hit('a');
    state.hit('b');
    expect(state.isWin()).toBe(true);
  });

  it('reduces hearts on miss and fails at zero', () => {
    const state = createGameState(level);
    state.miss();
    state.miss();
    state.miss();
    expect(state.isFail()).toBe(true);
  });
});
