export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

type ProgressData = {
  currentLevel: number;
  cleared: number[];
};

const STORAGE_KEY = 'progress_v1';

function load(storage: StorageLike): ProgressData {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { currentLevel: 1, cleared: [] };
  try {
    const data = JSON.parse(raw) as ProgressData;
    if (!Array.isArray(data.cleared) || typeof data.currentLevel !== 'number') {
      return { currentLevel: 1, cleared: [] };
    }
    return data;
  } catch {
    return { currentLevel: 1, cleared: [] };
  }
}

function save(storage: StorageLike, data: ProgressData): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createProgressStore(storage: StorageLike) {
  let data = load(storage);

  const persist = () => save(storage, data);

  return {
    getCurrentLevel(): number {
      return data.currentLevel;
    },

    setCurrentLevel(level: number): void {
      data.currentLevel = Math.max(1, Math.floor(level));
      persist();
    },

    markLevelCleared(level: number): void {
      const lv = Math.floor(level);
      if (!data.cleared.includes(lv)) {
        data.cleared.push(lv);
      }
      if (lv + 1 > data.currentLevel) {
        data.currentLevel = lv + 1;
      }
      persist();
    },

    isUnlocked(level: number): boolean {
      const lv = Math.floor(level);
      if (lv <= 1) return true;
      return data.cleared.includes(lv - 1);
    },

    getClearedLevels(): number[] {
      return [...data.cleared];
    }
  };
}
