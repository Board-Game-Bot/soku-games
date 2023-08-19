import { Game, Renderer, RendererImpl } from '@soku-games/core';

export interface TRecord {
  reason: string;
  steps: string;
  initData: string;
}

@RendererImpl('recorder')
export class RecordRenderer extends Renderer {
  game?: Game;
  bindGame(
    game: Game,
    extra?: {
      getResult?: (record: TRecord) => void;
    },
  ): void {
    this.game = game;

    let initData: string = '';

    game.afterPrepare((strData) => {
      initData = strData;
    });

    const steps: string[] = [];

    game.afterStep((stepStr) => {
      steps.push(stepStr);
    });

    game.afterEnd((reason) => {
      extra?.getResult?.({
        reason,
        steps: steps.join('#'),
        initData,
      });
    });
  }
}
