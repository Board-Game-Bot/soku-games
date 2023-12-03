import { Game, GameImpl } from '@soku-games/core';
import { reverse } from './utils';
import { ReversiSnapshot } from './types';

export interface ReversiStepDetail {
  id: number;
  x: number;
  y: number;
}

@GameImpl('reversi')
export class ReversiGame extends Game {
  data: ReversiSnapshot = {
    grid: <number[][]>[],
    r: 0,
    c: 0,
    turn: 0,
  };

  allowed = true;

  toString(): string {
    const { data } = this;

    return `${data.r} ${data.c} ${data.grid.toString().replace(/,/g, ' ')}`;
  }

  isAllowed(): boolean {
    return this.allowed;
  }

  __end(): void {}

  __prepare(strData: string): void {
    /**
     * 初始化数据，格式：r c mask
     * r：行数
     * c：列数
     * mask：压缩后的网格
     */
    const [_r, _c, mask] = strData.split(' ');
    const r = +_r;
    const c = +_c;
    const grid = Array(r)
      .fill(0)
      .map(() => Array(c).fill(2));

    for (let i = 0; i < r; ++i)
      for (let j = 0; j < c; ++j)
        grid[i][j] = +mask[i * c + j];

    const data = { r, c, grid };

    Object.assign(this.data, data);
  }

  __start(): void {
    console.log('Reversi Game Start!');
  }

  __step(stepStr: string): ReversiStepDetail {
    if (stepStr === 'pas') {
      this.data.turn ^= 1;
      return { x: -1, y: -1, id: this.data.turn ^ 1 } ;
    }
    
    const [i, x, y] = stepStr.split('').map(x => +x);
    const turn = i === -1 ? this.data.turn : i;

    reverse(this.data.grid, turn, x, y);
    this.data.grid[x][y] = turn;

    this.data.turn ^= 1;

    return { x, y, id: turn };
  }

  __isStepValidFormat(stepStr: string): string {
    if (!/^[0-1]\d{2}$/.test(stepStr)) {
      return 'invalid';
    }
    const { data } = this;
    const [, x, y] = stepStr.split('').map((x) => +x);
    return 0 <= x && x < data.r && 0 <= y && y < data.c ? '' : 'invalid';
  }
}
