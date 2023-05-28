// @ts-nocheck

import { Game, GameImplement } from '../../game';

type InitData = {};

@GameImplement('__example__')
export class __Example__Game extends Game {
  initImpl(data: InitData): void {}

  stepImpl(s: string): void {}
}
