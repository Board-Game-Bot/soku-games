import { Controller, ControllerImpl } from '@soku-games/core';
import ConsoleReversiRenderer from './renderer';

@ControllerImpl('reversi')
export class ConsoleReversiController extends Controller {
  bindRenderer(
    renderer: ConsoleReversiRenderer,
    extra?: {
      bindController: (control: (strStep: string) => void) => void;
    },
  ): void {
    const { game } = renderer;
    const { bindController } = extra || {};
    const control = (strStep: string) => {
      if (!game) {
        return;
      }
      game.step(strStep);
    };
    bindController && bindController(control);
  }
}
