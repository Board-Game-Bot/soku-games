import { TRecord } from './renderer';
import { deepClone } from './utils';
import { Game, GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';

export interface TRecordPlayer {
  prepare: (record: TRecord) => void;
  step: () => boolean;
  revStep: () => boolean;
  stepTo: (target: number) => void;
}

@GamePluginImpl('record-controller')
export class RecordPlayer extends GamePlugin {
  bindGame(game: Game): { recordPlayer: TRecordPlayer } {
    if (!game) {
      throw new Error('There is not game instance on the renderer`.');
    }

    const dataStack: Record<string, any>[] = [];

    game.subscribe(LifeCycle.BEFORE_STEP, () => {
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
      game.publish('custom:render');
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

    return {
      recordPlayer: {
        prepare,
        step,
        revStep,
        stepTo,
      },
    };
  }
}
