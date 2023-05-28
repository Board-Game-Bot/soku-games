import { C } from '../../utils/c';
import { GameObject } from '../../game.object';
import { IPosition } from '../snake/game';
import { BackgammonGame } from './game';

export class Piece extends GameObject {
  id = 0;
  p = <[number, number]>[0, 0];
  isSelected = false;
  constructor(
    game: BackgammonGame,
    config: {
      id: number;
      p: [number, number];
    }
  ) {
    super(game);

    Object.assign(this, config);

    this.mkUpdater('move-to-target', (dt: number) => {
      if (!this.tp) return;
      const { p, tp, v } = this;
      const move_dist = v * dt;
      const dist = C.distance(p, tp);

      if (dist === 0) return;

      const actual_move = Math.min(move_dist, dist);
      const dx = tp[0] - p[0];
      const dy = tp[1] - p[1];

      p[0] += (actual_move * dx) / dist;
      p[1] += (actual_move * dy) / dist;
      this.v -= this.a * dt;
      this.v = Math.max(this.v, 0);

      if (this.v === 0) this.tp = null;
    });
  }

  a = 0;
  v = 0;
  tp: IPosition | null = [0, 0];
  isInHome = false;
  moveTo(...[t, c]: number[]) {
    const objs = this.game.objs;

    objs.splice(objs.indexOf(this), 1);

    const tp = calcPos(t, c);
    const shift = C.spdShift(this.p, tp, 0.5);

    Object.assign(this, shift);
    this.tp = tp;
    if (t === 26 + this.id) {
      this.isInHome = true;
    } else {
      this.isInHome = false;
    }

    objs.push(this);
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
