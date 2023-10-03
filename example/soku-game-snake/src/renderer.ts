import { SnakeGame } from './game';
import { deepClone } from './util';
import { GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';

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

    // 游戏开始，渲染一帧
    game.subscribe(LifeCycle.AFTER_START, render);
    // 步行一次，渲染
    game.subscribe(LifeCycle.AFTER_STEP, render);
    // 强制渲染
    game.subscribe('custom:render', render);
  }
}
