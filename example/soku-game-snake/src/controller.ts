import { GamePlugin, GamePluginImpl } from '@soku-games/core';
import { SnakeGame } from './game';

@GamePluginImpl('snake-controller')
export class ConsoleSnakeController extends GamePlugin {
  bindGame(game: SnakeGame): void | Record<string, any> {
    const control = (strStep: string) => {
      if (!game) {
        return;
      }
      game.step(strStep);
    };

    return {
      controller: {
        control,
      },
    };
  }
}
