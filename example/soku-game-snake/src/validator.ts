import { GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';
import { SnakeGame } from './game';
import { deepClone } from './util';

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
        if (newGrid[x][y] > 1)
          die |= 1 << i;
      });

      setTimeout(() => {
        if (die) {
          if (die === 3)
            game.end('draw game');
          else if (die === 1)
            game.end('1 win');
          else if (die === 2)
            game.end('0 win');
        }
      });
    });
  }
}
