import type { TargetPoint } from '../core/types';

export type LevelData = {
  id: number;
  title: string;
  bg: string;
  targetCount: number;
  initialHearts: number;
  initialHints: number;
  targets: TargetPoint[];
};

const baseHearts = 3;
const baseHints = 1;

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: '找猫',
    bg: 'res/levels/level01.png',
    targetCount: 2,
    initialHearts: baseHearts,
    initialHints: baseHints,
    targets: [
      { id: 'l1-1', x: 0.22, y: 0.72, r: 0.04 },
      { id: 'l1-2', x: 0.78, y: 0.36, r: 0.04 }
    ]
  },
  {
    id: 2,
    title: '找鸭子',
    bg: 'res/levels/level02.png',
    targetCount: 3,
    initialHearts: baseHearts,
    initialHints: baseHints,
    targets: [
      { id: 'l2-1', x: 0.18, y: 0.28, r: 0.038 },
      { id: 'l2-2', x: 0.52, y: 0.62, r: 0.038 },
      { id: 'l2-3', x: 0.84, y: 0.78, r: 0.038 }
    ]
  },
  {
    id: 3,
    title: '找星星',
    bg: 'res/levels/level03.png',
    targetCount: 4,
    initialHearts: baseHearts,
    initialHints: baseHints,
    targets: [
      { id: 'l3-1', x: 0.15, y: 0.6, r: 0.036 },
      { id: 'l3-2', x: 0.36, y: 0.2, r: 0.036 },
      { id: 'l3-3', x: 0.64, y: 0.42, r: 0.036 },
      { id: 'l3-4', x: 0.86, y: 0.65, r: 0.036 }
    ]
  },
  {
    id: 4,
    title: '找气球',
    bg: 'res/levels/level04.png',
    targetCount: 5,
    initialHearts: baseHearts,
    initialHints: baseHints,
    targets: [
      { id: 'l4-1', x: 0.12, y: 0.82, r: 0.034 },
      { id: 'l4-2', x: 0.32, y: 0.42, r: 0.034 },
      { id: 'l4-3', x: 0.52, y: 0.2, r: 0.034 },
      { id: 'l4-4', x: 0.7, y: 0.55, r: 0.034 },
      { id: 'l4-5', x: 0.88, y: 0.32, r: 0.034 }
    ]
  },
  {
    id: 5,
    title: '找蘑菇',
    bg: 'res/levels/level05.png',
    targetCount: 6,
    initialHearts: baseHearts,
    initialHints: baseHints,
    targets: [
      { id: 'l5-1', x: 0.14, y: 0.66, r: 0.032 },
      { id: 'l5-2', x: 0.28, y: 0.34, r: 0.032 },
      { id: 'l5-3', x: 0.42, y: 0.78, r: 0.032 },
      { id: 'l5-4', x: 0.58, y: 0.48, r: 0.032 },
      { id: 'l5-5', x: 0.72, y: 0.22, r: 0.032 },
      { id: 'l5-6', x: 0.88, y: 0.6, r: 0.032 }
    ]
  }
];
