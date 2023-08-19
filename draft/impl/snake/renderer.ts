import { Renderer } from '../../renderer/base';
import { RendererImplement } from '../../renderer/decorator';
import { SnakeGame } from './game';

@RendererImplement('snake')
export class SnakeRenderer extends Renderer {
  initImpl(): void {
    const game = this.game! as SnakeGame;
    const screen = this.screen!;
    const { rows, cols } = game;

    screen.setAspectRatio(cols, rows);

    this.rendererMap.set('render-bg', () => {
      const { g } = screen;
      const { grid } = game;

      grid.forEach((_, i) => {
        _.forEach((c, j) => {
          g.Rect({
            y: i,
            x: j,
            lx: 1,
            ly: 1,
            color: c ? '#896c50' : ((i + j) & 1) === 0 ? '#efefef' : '#dddddd',
          });
        });
      });
    });

    this.rendererMap.set('render-snake-body', () => {
      const { g } = screen;
      const { snakes, grid } = game;

      snakes.forEach(({ cells }, i) => {
        const isDead =
          grid[cells[0][0]][cells[0][1]] === 1 ||
          -1 !==
            cells
              .slice(1)
              .findIndex((x) => x[0] === cells[0][0] && x[1] === cells[0][1]) ||
          -1 !==
            snakes[1 - i].cells.findIndex(
              (x) => x[0] === cells[0][0] && x[1] === cells[0][1]
            );

        cells.reduce((pre, cur) => {
          const [dx, dy] = [pre[0] - cur[0], pre[1] - cur[1]];
          if (!!dx) {
            g?.Rect({
              y: Math.min(pre[0], cur[0]) + 0.5,
              x: pre[1] + 0.1,
              ly: Math.abs(dx),
              lx: 0.8,
              color: isDead ? '#fff' : i ? '#00c' : '#c00',
            });
          } else {
            g?.Rect({
              y: pre[0] + 0.1,
              x: Math.min(pre[1], cur[1]) + 0.5,
              ly: 0.8,
              lx: Math.abs(dy),
              color: isDead ? '#fff' : i ? '#00c' : '#c00',
            });
          }
          return cur;
        });
      });
    });

    this.rendererMap.set('render-snake-cells', () => {
      const { g } = screen;
      const { snakes, grid } = game;

      snakes.forEach(({ cells }, i) => {
        const isDead =
          grid[cells[0][0]][cells[0][1]] === 1 ||
          -1 !==
            cells
              .slice(1)
              .findIndex((x) => x[0] === cells[0][0] && x[1] === cells[0][1]) ||
          -1 !==
            snakes[1 - i].cells.findIndex(
              (x) => x[0] === cells[0][0] && x[1] === cells[0][1]
            );

        cells.forEach((c) => {
          const [x, y] = c;
          g?.Cir({
            x: y + 0.5,
            y: x + 0.5,
            radius: 0.4,
            color: isDead ? '#fff' : i ? '#00c' : '#c00',
          });
        });
        const [x, y] = cells[0];
        g?.Cir({
          x: y + 0.5,
          y: x + 0.5,
          radius: 0.2,
          color: isDead ? '#000' : '#fff',
        });
      });
    });
  }
}
