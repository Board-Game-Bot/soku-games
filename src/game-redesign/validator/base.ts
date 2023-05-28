import { Game } from '../game/base';

export abstract class Validator {
  game?: Game;

  setGame(game: Game) {
    this.game = game;

    game.before.on('step', (s: string, isOk: { v: boolean }) => {
      isOk.v = this.checkImpl(s);
    });

    game.after.on('step', (s: string) => {
      this.afterImpl(s);
    });
  }

  abstract checkImpl(s: string): boolean;

  abstract afterImpl(s: string): void;
}
