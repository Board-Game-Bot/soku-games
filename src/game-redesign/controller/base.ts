import { Game } from '../game/base';

export abstract class Controller {
  game?: Game;

  setGame(game: Game) {
    this.game = game;
    game.deps.set('controller', this);

    game.after.on('start', () => {
      this.initImpl();
    });

    game.after.on('stop', () => {
      this.game?.deps.delete('controller');
    });
  }

  abstract initImpl(): void;
}
