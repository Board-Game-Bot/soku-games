import Game from './game';

/**
 * The base of Validator
 */
export default abstract class Validator {
  abstract bindGame(game: Game): void;
}
