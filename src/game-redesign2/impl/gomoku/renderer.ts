import { Renderer } from '../../renderer/base';
import { RendererImplement } from '../../renderer/decorator';
import { GomokuGame } from './game';

@RendererImplement('gomoku')
export class GomokuRenderer extends Renderer {
  initImpl(): void {
    const game = this.game! as GomokuGame;

    this.screen?.setAspectRatio(game.col + 1, game.row + 1);

    this.rendererMap.set('render-bg', () => {
      const { g } = this.screen!;

      g.Rect({
        y: 0,
        x: 0,
        ly: game.row + 2,
        lx: game.col + 2,
        color: '#cca',
      });

      g.Cir({
        x: (game.row >> 1) + 1,
        y: (game.col >> 1) + 1,
        radius: 0.2,
      });
    });

    this.rendererMap.set('render-border', () => {
      const { g } = this.screen!;

      function repeat(n: number, fn: Function) {
        for (let i = 0; i < n; ++i) fn(i);
      }

      repeat(game.row, (i: number) => {
        g.Seg({
          y0: i + 1,
          x0: 1,
          y1: i + 1,
          x1: game.col,
          width: 0.02,
        });
      });

      repeat(game.col, (i: number) => {
        g.Seg({
          y0: 1,
          x0: i + 1,
          y1: game.row,
          x1: i + 1,
          width: 0.02,
        });
      });
    });

    this.rendererMap.set('render-chess', () => {
      const { g } = this.screen!;
      game.grid.forEach((r, i) => {
        r.forEach((c, j) => {
          if (c !== 2) {
            g.Cir({
              x: j + 1,
              y: i + 1,
              radius: 0.4,
              color: c ? '#ddd' : '#333',
            });
          }
        });
      });
    });

    this.rendererMap.set('render-last-put', () => {
      if (!game.lastPut.length) {
        return;
      }

      const { g } = this.screen!;
      const put = game.lastPut.at(-1)!;
      const [x, y] = put;

      g.Cir({
        x: y + 1,
        y: x + 1,
        radius: 0.1,
        color: '#f00',
      });
    });
  }
}
