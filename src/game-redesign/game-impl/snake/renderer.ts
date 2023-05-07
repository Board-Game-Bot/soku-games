import { GameObject } from '../../game.object';
import { SnakeGame } from './game';

export class Renderer extends GameObject {
  constructor(game: SnakeGame) {
    super(game);

    this.mkUpdater('render-map', () => {
      const L = game.L!;
      const g = game.g!;

      (game as SnakeGame).grid.forEach((_, i) => {
        _.forEach((_, j) => {
          g.Rect({
            y: i * L,
            x: j * L,
            lx: L,
            ly: L,
            color: _ ? '#896c50' : ((i + j) & 1 && '#dddddd') || '#efefef',
          });
        });
      });
    });

    this.mkUpdater('render-snake-body', () => {
      const L = this.L!;
      const g = game.g;
      const snakes = game.snakes;

      snakes.forEach(({ shownCells, color }) => {
        shownCells.reduce((pre, cur) => {
          const [dx, dy] = [pre[0] - cur[0], pre[1] - cur[1]];
          if (!!dx) {
            g?.Rect({
              y: (Math.min(pre[0], cur[0]) + 0.5) * L,
              x: (pre[1] + 0.1) * L,
              ly: Math.abs(dx) * L,
              lx: 0.8 * L,
              color,
            });
          } else {
            g?.Rect({
              y: (pre[0] + 0.1) * L,
              x: (Math.min(pre[1], cur[1]) + 0.5) * L,
              ly: 0.8 * L,
              lx: Math.abs(dy) * L,
              color,
            });
          }
          return cur;
        });
      });
    });

    this.mkUpdater('render-snake-cells', () => {
      const L = this.L!;
      const g = game.g;
      const snakes = game.snakes;

      snakes.forEach(({ shownCells, color, eyeColor }) => {
        shownCells.forEach((c) => {
          const [x, y] = c;
          g?.Cir({
            x: (y + 0.5) * L,
            y: (x + 0.5) * L,
            radius: 0.4 * L,
            color,
          });
        });
        const [x, y] = shownCells[0];
        g?.Cir({
          x: (y + 0.5) * L,
          y: (x + 0.5) * L,
          radius: 0.2 * L,
          color: eyeColor,
        });
      });
    });
  }
}
