import { GamePlugin, GamePluginImpl } from '@soku-games/core';
import { ReversiGame } from './game';

@GamePluginImpl('reversi-controller')
export class ConsoleReversiController extends GamePlugin {
  bindGame(game: ReversiGame) {
    const control = (strStep: string) => {
      if (!game) {
        return;
      }
      game.step(strStep);
    };
    return {
      controller: { control },
    };
  }
}
