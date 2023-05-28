import { GameObject } from '../../game.object';
import { ReversiGame } from './game';

export class Renderer extends GameObject {
  constructor(game: ReversiGame) {
    super(game);

    this.mkUpdater('render-grid', () => {
      const g = game.g!;
      const L = this.L!;
      const r = game.r;
      const c = game.c;

      g.Rect({
        x: 0,
        y: 0,
        lx: c * L,
        ly: r * L,
        color: '#080',
      });

      for (let i = 0; i <= r; ++i) {
        g.Seg({
          y0: i * L,
          x0: 0,
          y1: i * L,
          x1: c * L,
          color: '#000',
          width: 0.02 * L,
        });
      }

      for (let i = 0; i <= c; ++i) {
        g.Seg({
          y0: 0,
          x0: i * L,
          y1: r * L,
          x1: i * L,
          color: '#000',
          width: 0.02 * L,
        });
      }
    });

    this.mkUpdater('render-pieces', () => {
      const g = game.g!;
      const L = this.L!;
      const grid = game.grid;

      grid.forEach((r, i) => {
        r.forEach((c, j) => {
          if (c !== 2) {
            g.Cir({
              y: (i + 0.5 + 0.05) * L,
              x: (j + 0.5) * L,
              radius: 0.4 * L,
              color: c ? '#000' : '#fff',
            });
            g.Cir({
              y: (i + 0.5) * L,
              x: (j + 0.5) * L,
              radius: 0.4 * L,
              color: c ? '#fff' : '#000',
            });
          }
        });
      });
    });

    this.mkUpdater('render-last-place', () => {
      const { g, L, lastPlace } = game;

      if (!lastPlace) return;

      const [x, y] = lastPlace;

      g?.Cir({
        x: (y + 0.5) * L!,
        y: (x + 0.5) * L!,
        radius: 0.1 * L!,
        color: '#77a',
      });
    });
  }
}
