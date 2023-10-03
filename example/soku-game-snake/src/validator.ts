import { SnakeGame } from './game';
import { deepClone } from './util';
import { GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';

@GamePluginImpl('snake-validator')
export class SnakeValidator extends GamePlugin {
  bindGame(game: SnakeGame) {
    game.subscribe(LifeCycle.AFTER_STEP, () => {
      const { snakes, grid } = game.data;
      const newGrid = deepClone(grid);
      let die = 0;
      snakes.forEach((snake) => {
        snake.forEach(([x, y]) => newGrid[x][y]++);
      });

      snakes.forEach((snake, i) => {
        const [x, y] = snake[0];
        if (newGrid[x][y] > 1) {
          die |= 1 << i;
        }
      });

      setTimeout(() => {
        if (die) {
          if (die === 3) {
            game.end(`双方平局：两蛇皆撞`);
          } else if (die === 1) {
            game.end(`零蛇战败`);
          } else if (die === 2) {
            game.end(`壹蛇战败`);
          }
        }
      });
    });
  }
}
