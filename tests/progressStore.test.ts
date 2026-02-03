import { describe, it, expect } from 'vitest';
import { createProgressStore } from '../assets/scripts/core/progressStore';

const memoryStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => map.set(k, v),
  };
};

describe('progress store', () => {
  it('unlocks next level after win', () => {
    const store = createProgressStore(memoryStorage());
    store.setCurrentLevel(1);
    store.markLevelCleared(1);
    expect(store.isUnlocked(2)).toBe(true);
  });
});
