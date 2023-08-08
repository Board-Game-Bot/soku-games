import { Renderer, RendererImpl } from '@soku-games/core';
import { SnakeGame } from './game';
import { deepClone } from './util';

/**
 * console 渲染
 */
@RendererImpl('snake')
export class ConsoleSnakeRenderer extends Renderer {
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
      const { grid, snakes } = game;
      const newGrid = deepClone(grid);

      snakes.forEach((snake, i) => {
        const c = i === 0 ? 'A' : 'B';
        snake.forEach(([x, y]) => {
          newGrid[x][y] = c;
        });
      });

      print(newGrid.map((row: string[]) => row.join(' ')).join('\n'));
    }

    // 游戏开始，渲染一帧
    game.afterStart(() => {
      render();
    });

    // 步行一次，渲染
    game.afterStep(() => {
      render();
    });
  }
}
