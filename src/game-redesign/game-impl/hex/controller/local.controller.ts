import { Controller } from '../../../controller.base';
import { GameControllerImplement } from '../../../controller.decorator';
import { findPosition, HexGame } from '../game';

@GameControllerImplement('local', 'hex', 4)
export class HexLocalController extends Controller {
  setGame(game: HexGame): void {
    super.setGame(game);

    const canvas = game.canvas!;
    const clickFn = (e: MouseEvent) => {
      const L = game.L!;
      const p = findPosition(e.offsetY / L, e.offsetX / L);
      if (!p) return;

      const [x, y] = p;
      game.step(`${game.turn}${x.toString(36)}${y.toString(36)}`);
    };
    canvas.addEventListener('mousedown', clickFn);
    game.before.on('stop', () => {
      canvas.removeEventListener('mousedown', clickFn);
    });

    const moveFn = (e: MouseEvent) => {
      const L = game.L!;
      const p = findPosition(e.offsetY / L, e.offsetX / L);
      if (!p) return;

      game.currentPosition = p;
    };
    canvas.addEventListener('mousemove', moveFn);
    game.before.on('stop', () => {
      canvas.removeEventListener('mousemove', moveFn);
    });
  }
}
