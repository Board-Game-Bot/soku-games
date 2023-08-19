import { Game, Validator, ValidatorImpl } from '@soku-games/core';

@ValidatorImpl('{{name}}')
export class __name__Validator extends Validator {
  bindGame(game: Game): void {}
}
