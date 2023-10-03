import { Game } from './game';

export abstract class GamePlugin {
  abstract bindGame(game: Game, extra?: any): void | Record<string, any>;
}
