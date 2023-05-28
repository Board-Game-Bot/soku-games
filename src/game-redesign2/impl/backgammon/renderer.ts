import { Renderer } from '@/game-redesign2/renderer/base';
import { RendererImplement } from '@/game-redesign2/renderer/decorator';
import { BackgammonGame } from './game';

@RendererImplement('backgammon')
export class BackgammonRenderer extends Renderer {
  initImpl(): void {
    const screen = this.screen!;
    const game = this.game as BackgammonGame;

    screen.setAspectRatio(14, 11);

    this.rendererMap.set('render-board', () => {
      const g = screen.g;
      const [r, c] = [11, 14];

      g.Rect({
        y: 0,
        x: 0,
        ly: r,
        lx: c,
        color: '#e3ac72',
      });
    });

    this.rendererMap.set('render-triangle', () => {
      const g = screen.g;

      for (let i = 0; i < 6; ++i) {
        const y = i;
        // 上方
        g.Poly({
          ps: [
            [0, y],
            [0, y + 1],
            [5, y + 0.5],
          ],
          color: i % 2 ? '#800' : '#ddd',
        });
        g.Poly({
          ps: [
            [0, y + 7],
            [0, y + 8],
            [5, y + 7.5],
          ],
          color: i % 2 ? '#800' : '#ddd',
        });

        // 下方
        g.Poly({
          ps: [
            [11, y],
            [11, y + 1],
            [6, y + 0.5],
          ],
          color: i % 2 ? '#ddd' : '#800',
        });
        g.Poly({
          ps: [
            [11, y + 7],
            [11, y + 8],
            [6, y + 7.5],
          ],
          color: i % 2 ? '#ddd' : '#800',
        });
      }
    });

    this.rendererMap.set('render-piece', () => {
      const g = screen.g!;
      const pieces = game.pieces
        .reduce((pre, cur) => {
          return pre.concat(cur);
        })
        .sort((a, b) => a.now - b.now);

      pieces.forEach((p) => {
        const {
          p: [x, y],
          isInHome,
          id,
          isSelected,
        } = p;

        if (!isInHome) {
          g.Cir({
            y: x,
            x: y,
            radius: 0.5,
            color: '#222',
          });
          g.Cir({
            y: x,
            x: y,
            radius: 0.5 * 0.95,
            color: id ? '#900' : '#ccc',
          });

          if (isSelected) {
            g.Cir({
              y: x,
              x: y,
              radius: 0.2,
              color: '#005',
            });
          }
        } else {
          g.Rect({
            y: x,
            x: y,
            ly: 0.33,
            lx: 1,
            color: id ? '#900' : '#ccc',
          });
          g.StrokePoly({
            ps: [
              [x, y],
              [x, y + 1],
              [x + 0.33, y + 1],
              [x + 0.33, y],
            ],
            color: '000',
            width: 0.05,
          });
        }
      });
    });

    const pos = [1, -1, 3, -3];
    this.rendererMap.set('render-dice', () => {
      const g = screen.g!;
      const dice = game.dice;
      const turn = game.turn;

      dice.forEach((d, i) => {
        const ox = 5;
        const oy = 6 + pos[i];
        g.Rect({
          y: ox + 0.1,
          x: oy + 0.1,
          ly: 0.8,
          lx: 0.8,
          color: turn ? '#800' : '#ddd',
        });

        g.Text({
          y: ox + 0.8,
          x: oy + 0.2,
          font: `1px monospace`,
          color: turn ? '#ddd' : '#800',
          text: '' + d,
        });
      });
    });

    this.rendererMap.set('render-path', () => {
      const { g } = screen;
      const game = this.game! as BackgammonGame;
      if (!game.movePath) {
        return;
      }
      const [[y0, x0], [y1, x1]] = game.movePath;

      g.Seg({
        x0,
        y0,
        x1,
        y1,
        width: 0.05,
        color: '#222',
      });
    });
  }
}
