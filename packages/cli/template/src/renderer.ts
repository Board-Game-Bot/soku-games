import { Game, Renderer, RendererImpl } from '@soku-games/core';

@RendererImpl('{{name}}')
export default class __name__Renderer extends Renderer {
  game?: Game;
  bindGame(game: Game): void {
    this.game = game;
  }
}
