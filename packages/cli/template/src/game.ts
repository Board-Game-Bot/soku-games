import { Game, GameImpl } from '@soku-games/core';
import { StepResult } from './types';

@GameImpl('{{name}}')
export class __name__Game extends Game {
  data = {};
  __end(reason: string): void {}

  __prepare(strData: string): void {}

  __start(): void {}

  __step(stepStr: string): void | StepResult {}

  __isStepValidFormat(stepStr: string): string {
    return '';
  }
}
