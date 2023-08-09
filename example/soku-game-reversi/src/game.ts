import { Game, GameImpl } from '@soku-games/core';

@GameImpl('reversi')
export class ReversiGame extends Game {
  grid: number[][] = [];
  r = 0;
  c = 0;
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

    Object.assign(this, { r, c, grid });
  }

  _start(): void {
    console.log('Reversi Game Start!');
  }

  _step(stepStr: string): void {
    /**
     * 一步数据格式：{id}{r}{c}
     */
    const [id, r, c] = stepStr.split('').map((x) => +x);
    this.grid[r][c] = id;
  }

  isValidFormat(stepStr: string): boolean {
    if (!/^[0-1]\d\d$/.test(stepStr)) {
      return false;
    }
    const [, x, y] = stepStr.split('').map((x) => +x);
    return 0 <= x && x < this.r && 0 <= y && y < this.c;
  }
}
