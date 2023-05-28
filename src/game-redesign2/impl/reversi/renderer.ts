import { Renderer } from '../../renderer/base';
import { RendererImplement } from '../../renderer/decorator';
import { ReversiGame } from './game';

@RendererImplement('reversi')
export class ReversiRenderer extends Renderer {
  initImpl(): void {
    const screen = this.screen!;
    const { r, c } = this.game as ReversiGame;

    screen.setAspectRatio(c, r);

    this.rendererMap.set('render-grid', () => {
      const { g } = screen;
      const { r, c } = this.game as ReversiGame;

      g.Rect({
        x: 0,
        y: 0,
        lx: c,
        ly: r,
        color: '#080',
      });

      for (let i = 0; i <= r; ++i) {
        g.Seg({
          y0: i,
          x0: 0,
          y1: i,
          x1: c,
          color: '#000',
          width: 0.02,
        });
      }

      for (let i = 0; i <= c; ++i) {
        g.Seg({
          y0: 0,
          x0: i,
          y1: r,
          x1: i,
          color: '#000',
          width: 0.02,
        });
      }
    });

    this.rendererMap.set('render-pieces', () => {
      const { g } = screen;
      const { grid } = this.game! as ReversiGame;

      grid.forEach((r, i) => {
        r.forEach((c, j) => {
          if (c !== 2) {
            g.Cir({
              y: i + 0.5 + 0.05,
              x: j + 0.5,
              radius: 0.4,
              color: c ? '#000' : '#fff',
            });
            g.Cir({
              y: i + 0.5,
              x: j + 0.5,
              radius: 0.4,
              color: c ? '#fff' : '#000',
            });
          }
        });
      });
    });

    this.rendererMap.set('render-last-place', () => {
      const { g } = screen;
      const { lastPlace } = this.game! as ReversiGame;

      if (!lastPlace) return;

      const [x, y] = lastPlace;

      g?.Cir({
        x: y + 0.5,
        y: x + 0.5,
        radius: 0.1,
        color: '#77a',
      });
    });
  }
}
