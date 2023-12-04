import { CustomEvent, GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';
import { SnakeGame } from './game.js';
import { deepClone } from './util.js';

/**
 * console 渲染
 */
@GamePluginImpl('snake-renderer')
export class ConsoleSnakeRenderer extends GamePlugin {
  game?: SnakeGame;
  bindGame(
    game: SnakeGame,
    extra: {
      print: (...str: string[]) => void;
    },
  ): void {
    this.game = game;

    const { print } = extra;
    function render() {
      const { grid, snakes } = game.data;
      const newGrid = deepClone(grid).map((row) =>
        row.map((col) => col.toString()),
      );

      snakes.forEach((snake, i) => {
        const c = i === 0 ? 'A' : 'B';
        snake.forEach(([x, y]) => {
          newGrid[x][y] = c;
        });
      });

      print(newGrid.map((row) => row.join(' ')).join('\n'));
    }

    game.subscribe(
      [LifeCycle.AFTER_START, LifeCycle.AFTER_STEP, CustomEvent.CHANGE_SNAPSHOT],
      render,
    );
  }
}
