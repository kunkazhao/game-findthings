import { describe, it, expect } from 'vitest';
import { findHitTarget } from '../assets/scripts/core/hitTest';

const targets = [
  { id: 'a', x: 0.5, y: 0.5, r: 0.05 },
  { id: 'b', x: 0.8, y: 0.2, r: 0.05 },
];

describe('findHitTarget', () => {
  it('returns hit target id when within radius', () => {
    expect(findHitTarget({ x: 0.52, y: 0.52 }, targets, new Set())).toBe('a');
  });

  it('returns null when no target hit', () => {
    expect(findHitTarget({ x: 0.1, y: 0.1 }, targets, new Set())).toBe(null);
  });

  it('skips already found targets', () => {
    const found = new Set(['a']);
    expect(findHitTarget({ x: 0.52, y: 0.52 }, targets, found)).toBe(null);
  });
});
