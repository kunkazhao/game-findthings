export type GameLevel = {
  targetIds: string[];
  hearts: number;
  hints: number;
};

export function createGameState(level: GameLevel) {
  const found = new Set<string>();
  let hearts = Math.max(0, Math.floor(level.hearts));
  let hints = Math.max(0, Math.floor(level.hints));

  return {
    hit(id: string): void {
      if (id && !found.has(id)) {
        found.add(id);
      }
    },

    miss(): void {
      hearts = Math.max(0, hearts - 1);
    },

    useHint(): boolean {
      if (hints <= 0) return false;
      hints -= 1;
      return true;
    },

    addHint(count = 1): void {
      hints += Math.max(0, Math.floor(count));
    },

    getHearts(): number {
      return hearts;
    },

    getHints(): number {
      return hints;
    },

    getFoundCount(): number {
      return found.size;
    },

    getRemainingTargetIds(): string[] {
      return level.targetIds.filter((id) => !found.has(id));
    },

    isWin(): boolean {
      return found.size >= level.targetIds.length;
    },

    isFail(): boolean {
      return hearts <= 0;
    }
  };
}
