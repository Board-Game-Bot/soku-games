import { Game, GameImpl } from '@soku-games/core';

@GameImpl('reversi')
export default class ReversiGame extends Game {
  _end(reason: string): void {}

  _prepare(strData: string): void {}

  _start(): void {
    console.log('Reversi Game Start!');
  }

  _step(stepStr: string): void {}

  isValidFormat(stepStr: string): boolean {
    return false;
  }

  shouldStep(stepStr: string): boolean {
    return false;
  }
}
