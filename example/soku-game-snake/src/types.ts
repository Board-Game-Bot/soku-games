export interface Extra {
  el: HTMLElement;
  couldControl: boolean[];
  emit: (stepStr: string) => void;
}

export type P = [number, number];

export interface SnakeSnapshot {
  grid: number[][];
  r: number;
  c: number;
  snakes: P[][];
}