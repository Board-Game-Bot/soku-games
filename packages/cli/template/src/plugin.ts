import { Game, GamePluginImpl, GamePlugin } from '@soku-games/core';

@GamePluginImpl('{{name}}')
export class __name__Plugin extends GamePlugin {
  bindGame(game: Game): void {}
}
