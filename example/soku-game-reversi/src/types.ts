export interface Extra {
  el: HTMLElement;
  couldControl: boolean[];
  emit: (stepStr: string) => void;
}

export interface ReversiSnapshot {
  grid: number[][];
  r: number;
  c: number;
  turn: number;
}