// @ts-nocheck

import { Game, GameImplement } from 'soku-games';

type InitData = {};

@GameImplement('__example__')
export class __Example__Game extends Game {
  initImpl(data: InitData): void {}

  stepImpl(s: string): void {}
}
