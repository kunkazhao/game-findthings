export function pickHintTarget(
  ids: string[],
  rng: () => number = Math.random
): string | null {
  if (ids.length === 0) return null;
  const idx = Math.floor(rng() * ids.length);
  return ids[idx] ?? null;
}
