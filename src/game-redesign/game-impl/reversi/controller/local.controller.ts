import { Controller } from '../../../controller.base';
import { GameControllerImplement } from '../../../controller.decorator';
import { ReversiGame } from '../game';

@GameControllerImplement('local', 'reversi', 2)
export class ReversiLocalController extends Controller {
  events = <[HTMLCanvasElement, 'mousedown', (e: MouseEvent) => void][]>[];
  setGame(game: ReversiGame) {
    super.setGame(game);

    game.before.on('stop', () => {
      this.destroy();
    });

    this.events.push([
      game.canvas!,
      'mousedown',
      (e) => {
        const [y, x] = [e.offsetX, e.offsetY];
        const L = game.L!;

        const [nx, ny] = [(x / L) >> 0, (y / L) >> 0];
        game.step(`${game.turn}${nx.toString(36)}${ny.toString(36)}`);
      },
    ]);

    this.events.forEach((x) => {
      x[0].addEventListener(x[1], x[2]);
    });

    return this;
  }

  destroy() {
    this.events.forEach((x) => {
      x[0].removeEventListener(x[1], x[2]);
    });
  }
}