export interface Point {
  x: number;
  y: number;
}

export interface TargetPoint extends Point {
  id: string;
  r: number;
}
