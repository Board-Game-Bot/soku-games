import { Game } from './game.base';

export class Controller {
  game: Game | null = null;
  setGame(game: Game) {
    this.game = game;
  }
}
