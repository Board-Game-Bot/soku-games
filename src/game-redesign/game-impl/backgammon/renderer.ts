import { GameObject } from '@/game-redesign/game.object';
import { BackgammonGame } from './game';

export class Renderer extends GameObject {
  constructor(game: BackgammonGame) {
    super(game);

    this.mkUpdater('render-board', () => {
      const L = this.L!;
      const g = game.g!;
      const [r, c] = [11, 14];

      g.Rect({
        y: 0,
        x: 0,
        ly: r * L,
        lx: c * L,
        color: '#e3ac72',
      });
    });

    this.mkUpdater('render-triangle', () => {
      const g = game.g!;
      const L = this.L!;

      for (let i = 0; i < 6; ++i) {
        const y = i * L;
        // 上方
        g.Poly({
          ps: [
            [0, y],
            [0, y + L],
            [5 * L, y + 0.5 * L],
          ],
          color: i % 2 ? '#800' : '#ddd',
        });
        g.Poly({
          ps: [
            [0, y + 7 * L],
            [0, y + 8 * L],
            [5 * L, y + 7.5 * L],
          ],
          color: i % 2 ? '#800' : '#ddd',
        });

        // 下方
        g.Poly({
          ps: [
            [11 * L, y],
            [11 * L, y + L],
            [6 * L, y + 0.5 * L],
          ],
          color: i % 2 ? '#ddd' : '#800',
        });
        g.Poly({
          ps: [
            [11 * L, y + 7 * L],
            [11 * L, y + 8 * L],
            [6 * L, y + 7.5 * L],
          ],
          color: i % 2 ? '#ddd' : '#800',
        });
      }
    });

    this.mkUpdater('render-piece', () => {
      const g = game.g!;
      const L = this.L!;

      game.pieces.forEach((ps) => {
        ps.forEach((p) => {
          const {
            p: [x, y],
            isInHome,
            id,
            isSelected,
          } = p;

          if (!isInHome) {
            g.Cir({
              y: x * L,
              x: y * L,
              radius: L / 2,
              color: '#222',
            });
            g.Cir({
              y: x * L,
              x: y * L,
              radius: (L / 2) * 0.95,
              color: id ? '#900' : '#ccc',
            });

            if (isSelected) {
              g.Cir({
                y: x * L,
                x: y * L,
                radius: L * 0.2,
                color: '#005',
              });
            }
          } else {
            g.Rect({
              y: x * L,
              x: y * L,
              ly: 0.33 * L,
              lx: L,
              color: id ? '#900' : '#ccc',
            });
            g.StrokePoly({
              ps: [
                [x * L, y * L],
                [x * L, (y + 1) * L],
                [(x + 0.33) * L, (y + 1) * L],
                [(x + 0.33) * L, y * L],
              ],
              color: '000',
              width: 0.05 * L,
            });
          }
        });
      });
    });

    const pos = [1, -1, 3, -3];
    this.mkUpdater('render-dice', () => {
      const g = game.g!;
      const dice = game.dice;
      const L = this.L!;
      const turn = game.turn;

      dice.forEach((d, i) => {
        const ox = 5;
        const oy = 6 + pos[i];
        g.Rect({
          y: (ox + 0.1) * L,
          x: (oy + 0.1) * L,
          ly: 0.8 * L,
          lx: 0.8 * L,
          color: turn ? '#800' : '#ddd',
        });

        g.Text({
          y: (ox + 0.8) * L,
          x: (oy + 0.2) * L,
          font: `${L}px monospace`,
          color: turn ? '#ddd' : '#800',
          text: '' + d,
        });
      });
    });
  }
}
