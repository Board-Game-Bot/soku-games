import { CustomEvent, GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';
import { ReversiGame } from './game';

@GamePluginImpl('reversi-renderer')
export default class ConsoleReversiRenderer extends GamePlugin {
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
        const { grid } = game.data;

        print(grid.map((row) => row.join(' ')).join('\n'));
      }
    }
    game.subscribe(
      [LifeCycle.AFTER_START, LifeCycle.AFTER_STEP, CustomEvent.CHANGE_SNAPSHOT],
      render,
    );
  }
}
