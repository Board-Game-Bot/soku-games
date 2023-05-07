import { SnakeGame } from './game';

export class Judgement {
  constructor(game: SnakeGame) {
    game.after.on('step', () => {
      const { grid, snakes } = game;

      snakes.forEach((s) => {
        s.cells.forEach(([x, y]) => {
          grid[x][y] += 1;
        });
      });

      let failed = 0;
      snakes.forEach((s, i) => {
        const [x, y] = s.cells[0];
        if (grid[x][y] > 1) {
          failed |= 1 << i;
          s.eyeColor = '#fff';
        }
      });

      snakes.forEach((s) => {
        s.cells.forEach(([x, y]) => {
          grid[x][y] -= 1;
        });
      });

      if (failed) {
        const flg = window && !!window.requestAnimationFrame;
        setTimeout(
          () => {
            if (failed !== 3) {
              game.stop(`${failed === 1 ? 0 : 1}号蛇碰撞致死`);
            } else {
              game.stop(`双方蛇均碰撞致死`);
              flg ? 200 : 0;
            }
          },
          flg ? 200 : 0
        );
      }
    });

    game.after.on('stop', (reason: string) => {
      console.log(`Game over: ${reason}`);
    });
  }
}
