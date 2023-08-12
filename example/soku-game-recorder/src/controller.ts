import { Controller, ControllerImpl } from '@soku-games/core';
import { RecordRenderer, TRecord } from './renderer';
import { deepClone } from './utils';

@ControllerImpl('recorder')
export class RecordPlayer extends Controller {
  bindRenderer(
    renderer: RecordRenderer,
    extra?: {
      bindController: (controller: any) => void;
    },
  ): void {
    const { game } = renderer;
    const { bindController } = extra || {};

    if (!game || !bindController) {
      return;
    }

    const dataStack: Record<string, any>[] = [];

    game.beforeStep(() => {
      dataStack.push(deepClone(game.data));
    });

    let initData = '';
    let steps: string[];
    let index = -1;
    let reason = '';

    const prepare = (record: TRecord) => {
      initData = record.initData;
      steps = record.steps.split('#');
      reason = record.reason;
      index = -1;

      game.prepare(initData);
      game.start();
    };

    const step = () => {
      if (index + 1 >= steps.length) {
        return false;
      }
      game.step(steps[++index]);
      return true;
    };

    const revStep = () => {
      if (dataStack.length <= 0) {
        return false;
      }
      --index;
      const data = dataStack.pop();
      Object.assign(game, { data });
      game.customEmit('render');
      return true;
    };

    const stepTo = (target: number) => {
      if (target >= steps.length || target < 0) {
        return false;
      }
      if (target > index) {
        for (let i = index; i < target; ++i) {
          step();
        }
      } else if (target < index) {
        for (let i = index; i > target; --i) {
          revStep();
        }
      }
      return true;
    };

    bindController({
      prepare,
      step,
      revStep,
      stepTo,
    });
  }
}
