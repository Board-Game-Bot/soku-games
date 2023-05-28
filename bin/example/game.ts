// @ts-nocheck

import { Game } from '../../game.base';
import { GameImplement } from '../../game.decorator';

type InitData = {};

@GameImplement('__example__')
export class __Example__Game extends Game {
  initImpl(data: InitData): void {}

  stepImpl(s: string): void {}
}
