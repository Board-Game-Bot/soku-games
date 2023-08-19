import { Controller, ControllerImpl } from '@soku-games/core';
import { ConsoleSnakeRenderer } from './renderer';

@ControllerImpl('snake')
export class ConsoleSnakeController extends Controller {
  bindRenderer(renderer: ConsoleSnakeRenderer): (strStep: string) => void {
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
