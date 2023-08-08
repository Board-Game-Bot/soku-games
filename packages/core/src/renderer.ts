import Game from './game';

/**
 * The base of Renderer
 */
export default abstract class Renderer {
  abstract bindGame(game: Game, extra?: any): void;
}
