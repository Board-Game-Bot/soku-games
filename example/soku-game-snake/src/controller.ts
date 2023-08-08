import { Controller, ControllerImpl } from '@soku-games/core';
import { ConsoleSnakeRenderer } from './renderer';

@ControllerImpl('snake')
export class ConsoleSnakeController extends Controller {
  bindRenderer(
    renderer: ConsoleSnakeRenderer,
    extra: {
      bindController: (control: (strStep: string) => void) => void;
    },
  ): void {
    const { game } = renderer;
    const { bindController } = extra;
    const control = (strStep: string) => {
      if (!game) {
        return;
      }
      game.step(strStep);
    };
    bindController(control);
  }
}
