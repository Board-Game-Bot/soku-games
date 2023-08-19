import { Controller, ControllerImpl } from '@soku-games/core';
import ConsoleReversiRenderer from './renderer';

@ControllerImpl('reversi')
export class ConsoleReversiController extends Controller {
  bindRenderer(renderer: ConsoleReversiRenderer): (strStep: string) => void {
    const { game } = renderer;
    const control = (strStep: string) => {
      if (!game) {
        return;
      }
      game.step(strStep);
    };
    return control;
  }
}
