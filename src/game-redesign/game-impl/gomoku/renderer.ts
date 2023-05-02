import { GameObject } from '@/game-redesign/game.object';
import { GomokuGame } from './game';

export class Renderer extends GameObject {
  constructor(game: GomokuGame) {
    super(game);

    this.mkUpdater('render-background', () => {
      const L = this.L!;
      const g = game.g!;

      g.Rect({
        y: 0,
        x: 0,
        ly: (game.row + 2) * L,
        lx: (game.col + 2) * L,
        color: '#cca',
      });

      g.Cir({
        x: ((game.row >> 1) + 1) * L,
        y: ((game.col >> 1) + 1) * L,
        radius: 0.2 * L,
      });
    });

    this.mkUpdater('render-border', () => {
      const L = this.L!;
      const g = game.g!;

      function repeat(n: number, fn: Function) {
        for (let i = 0; i < n; ++i) fn(i);
      }

      repeat(game.row, (i: number) => {
        g.Seg({
          y0: (i + 1) * L,
          x0: 1 * L,
          y1: (i + 1) * L,
          x1: game.col * L,
          width: 0.02 * L,
        });
      });

      repeat(game.col, (i: number) => {
        g.Seg({
          y0: 1 * L,
          x0: (i + 1) * L,
          y1: game.row * L,
          x1: (i + 1) * L,
          width: 0.02 * L,
        });
      });
    });

    this.mkUpdater('render-chess', () => {
      const g = game.g!;
      const L = this.L!;

      game.grid.forEach((r, i) => {
        r.forEach((c, j) => {
          if (c !== 2) {
            g.Cir({
              x: (j + 1) * L,
              y: (i + 1) * L,
              radius: 0.4 * L,
              color: c ? '#fff' : '#000',
            });
          }
        });
      });
    });

    this.mkUpdater('render-last-put', () => {
      if (!game.lastPut.length) return;
      const L = this.L!;
      const g = game.g!;
      const put = game.lastPut.at(-1)!;

      const [x, y] = put;
      g.Cir({
        x: (y + 1) * L,
        y: (x + 1) * L,
        radius: 0.1 * L,
        color: '#f00',
      });
    });
  }
}
