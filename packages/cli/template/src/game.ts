import { Game, GameImpl } from '@soku-games/core';

@GameImpl('{{name}}')
export class __name__Game extends Game {
  data = {};
  _end(reason: string): void {}

  _prepare(strData: string): void {}

  _start(): void {}

  _step(stepStr: string): void {}

  isValidFormat(stepStr: string): boolean {
    return false;
  }
}
