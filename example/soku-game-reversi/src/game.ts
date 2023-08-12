import { Game, GameImpl } from '@soku-games/core';
import { reverse } from './utils';

@GameImpl('reversi')
export class ReversiGame extends Game {
  data = {
    grid: <number[][]>[],
    r: 0,
    c: 0,
  };
  _end(reason: string): void {}

  _prepare(strData: string): void {
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

    for (let i = 0; i < r; ++i) {
      for (let j = 0; j < c; ++j) {
        grid[i][j] = +mask[i * c + j];
      }
    }

    const data = { r, c, grid };

    Object.assign(this, { data });
  }

  _start(): void {
    console.log('Reversi Game Start!');
  }

  _step(stepStr: string): void {
    /**
     * 一步数据格式：{id}{r}{c}
     */
    const [id, r, c] = stepStr.split('').map((x) => +x);
    reverse(this.data.grid, id, r, c);
    this.data.grid[r][c] = id;
  }

  isValidFormat(stepStr: string): boolean {
    if (!/^[0-1]\d\d$/.test(stepStr)) {
      return false;
    }
    const { data } = this;
    const [, x, y] = stepStr.split('').map((x) => +x);
    return 0 <= x && x < data.r && 0 <= y && y < data.c;
  }
}
