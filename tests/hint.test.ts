import { describe, it, expect } from 'vitest';
import { pickHintTarget } from '../assets/scripts/core/hint';

describe('pickHintTarget', () => {
  it('returns a remaining target deterministically with injected rng', () => {
    const rng = () => 0; // always first
    expect(pickHintTarget(['a', 'b', 'c'], rng)).toBe('a');
  });

  it('returns null when list is empty', () => {
    expect(pickHintTarget([], () => 0.5)).toBe(null);
  });
});
