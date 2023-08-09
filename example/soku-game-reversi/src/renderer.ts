import { Renderer, RendererImpl } from '@soku-games/core';
import { ReversiGame } from './game';

@RendererImpl('reversi')
export default class ConsoleReversiRenderer extends Renderer {
  game?: ReversiGame;
  bindGame(
    game: ReversiGame,
    extra?: {
      print: (...args: any[]) => void;
    },
  ): void {
    this.game = game;

    const { print } = extra || {};
    function render() {
      if (print) {
        const { grid } = game;

        print(grid.map((row) => row.join(' ')).join('\n'));
      }
    }
    game.afterStart(render);
    game.afterStep(render);
  }
}
