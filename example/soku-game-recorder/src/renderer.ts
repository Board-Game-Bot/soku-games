import { Game, Renderer, RendererImpl } from '@soku-games/core';

@RendererImpl('recorder')
export class RecordRenderer extends Renderer {
  bindGame(
    game: Game,
    extra?: {
      getResult?: (record: Record<string, any>) => void;
    },
  ): void {
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
