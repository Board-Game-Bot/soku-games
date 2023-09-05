import { Game, GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';

export interface TRecord {
  reason: string;
  steps: string;
  initData: string;
}

@GamePluginImpl('record-renderer')
export class RecordRenderer extends GamePlugin {
  game?: Game;
  bindGame(game: Game) {
    this.game = game;

    let initData: string = '';

    game.subscribe(LifeCycle.BEFORE_PREPARE, (strData) => {
      initData = strData;
    });

    const steps: string[] = [];

    game.subscribe(LifeCycle.BEFORE_STEP, (stepStr) => {
      steps.push(stepStr);
    });

    let resolve: (record: TRecord) => void;
    const resultPromise: Promise<TRecord> = new Promise((_resolve) => {
      resolve = _resolve;
    });

    game.subscribe(LifeCycle.AFTER_END, (reason) => {
      resolve({
        initData,
        steps: steps.join('#'),
        reason,
      });
    });

    return { resultPromise };
  }
}
