import { Game, GameImpl } from '@soku-games/core';
import { initialGrid } from './util';
import { dir } from './constants';
import { P, SnakeSnapshot } from './types';

@GameImpl('snake')
export class SnakeGame extends Game {
  data: SnakeSnapshot = {
    grid: [],
    r: 0,
    c: 0,
    snakes: [],
    dirs: [-1, -1],
    incr: [-1, -1],
  };

  __end(): void {}

  __prepare(strData: string): void {
    /**
     * 数据格式：r c mask
     * r: 行数
     * c: 列数
     * mask: 砖块扁平化后的一维字符串
     */
    const { r, c, grid } = initialGrid(strData);

    const snakes: P[][] = (() => {
      // snake 0
      const snake0: P[] = [[r - 2, 1]];
      const snake1: P[] = [[1, c - 2]];
      return [snake0, snake1];
    })();

    const data = { r, c, grid, snakes };

    Object.assign(this.data, data);
  }

  __start(): void {
    console.log('Snake Game Start!');
  }

  __step(stepStr: string): void {
    /**
     * 数据格式：{i}{d}{incr}
     * i: 哪条蛇
     * d: 方向
     * incr: 是否增长
     * 方向：0 1 2 3 从上开始顺时针
     * snake[0..n] 0 是蛇头，顺延到蛇尾
     */
    const [i, d, incr] = stepStr.split('').map(Number);
    this.data.dirs[i] = d;
    this.data.incr[i] = incr;

    if (this.data.dirs.every(i => ~i)) {
      for (let i = 0; i < 2; ++i) {
        const d = this.data.dirs[i];
        const incr = this.data.incr[i];
        const { data } = this;
        const snake = data.snakes[i];
        const h = [...snake[0]];
        const nh = h.map((x, j) => x + dir[j][d]);

        snake.unshift(nh as P);
        if (!incr)
          snake.pop();
      }
      this.data.dirs = [-1, -1];
      this.data.incr = [-1, -1];
    }
    return;
  }

  __isStepValidFormat(stepStr: string): string {
    return /^[0-3]{2}[0-1]$/.test(stepStr) || /^[0-1][0-3]$/.test(stepStr) ? '' : 'invalid';
  }
}
