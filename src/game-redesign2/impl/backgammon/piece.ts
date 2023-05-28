import { BackgammonGame } from './game';

type IPosition = [number, number];

export class Piece {
  id = 0;
  p = <[number, number]>[0, 0];
  isSelected = false;
  game: BackgammonGame;
  now = 0;

  constructor(
    game: BackgammonGame,
    config: {
      id: number;
      p: [number, number];
    }
  ) {
    this.game = game;
    this.now = Date.now();

    Object.assign(this, config);
  }

  a = 0;
  v = 0;
  tp: IPosition | null = [0, 0];
  isInHome = false;
  moveTo(...[t, c]: number[]) {
    const tp = calcPos(t, c);
    const op = [...this.p];

    this.p = tp;
    this.now = Date.now();

    if (t === 26 + this.id) {
      this.isInHome = true;
    } else {
      this.isInHome = false;
    }

    return [op, tp];
  }
}

export function calcPos(i: number, count: number): [number, number] {
  let result = <[number, number]>[0, 0];
  if (1 <= i && i <= 12) {
    const y = 13.5 - i - (i > 6 ? 1 : 0);
    let x = 0.5;
    for (let j = 0, k = 0; j < count; ++j) {
      if (j === 0 || j === 5 || j === 9 || j === 12 || j === 14) x = ++k * 0.5;
      x += 1;
    }
    x -= 1;
    result = [x, y];
  } else if (13 <= i && i <= 24) {
    const y = i - 12.5 + (i > 18 ? 1 : 0);
    let x = 0.5;
    for (let j = 0, k = 0; j < count; ++j) {
      if (j === 0 || j === 5 || j === 9 || j === 12 || j === 14 || j === 15)
        x = ++k * 0.5;
      x += 1;
    }
    x -= 1;
    x = 11 - x;
    result = [x, y];
  } else if (i === 0) {
    // 白棋回老家
    const y = 6.5;
    let x = 0.5;
    for (let j = 0, k = 0; j < count; ++j) {
      if (j === 0 || j === 5 || j === 9 || j === 12 || j === 14 || j === 15)
        x = ++k * 0.5;
      x += 1;
    }
    x -= 1;
    result = [x, y];
  } else if (i === 27) {
    // 红棋归位
    let x = 0;
    const y = 13;
    for (let i = 1; i < count; ++i) x += 0.33;
    result = [x, y];
  } else if (i === 25) {
    // 红棋回老家
    const y = 6.5;
    let x = 0.5;
    for (let j = 0, k = 0; j < count; ++j) {
      if (j === 0 || j === 5 || j === 9 || j === 12 || j === 14 || j === 15)
        x = ++k * 0.5;
      x += 1;
    }
    x -= 1;
    x = 11 - x;
    result = [x, y];
  } else if (i === 26) {
    // 白棋归位
    let x = 11 - 0.33;
    const y = 13;
    for (let i = 1; i < count; ++i) x -= 0.33;
    result = [x, y];
  }
  return result;
}
