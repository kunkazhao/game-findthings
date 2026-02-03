import type { Point, TargetPoint } from './types';

export function findHitTarget(
  point: Point,
  targets: TargetPoint[],
  found: Set<string>
): string | null {
  let hitId: string | null = null;
  let bestDistSq = Number.POSITIVE_INFINITY;

  for (const target of targets) {
    if (found.has(target.id)) continue;
    const dx = point.x - target.x;
    const dy = point.y - target.y;
    const distSq = dx * dx + dy * dy;
    if (distSq <= target.r * target.r && distSq < bestDistSq) {
      hitId = target.id;
      bestDistSq = distSq;
    }
  }

  return hitId;
}
