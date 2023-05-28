import { Controller } from '../../controller/base';
import { ControllerImplement } from '../../controller/decorator';
import { Renderer } from '../../renderer/base';
import { ReversiGame } from './game';

@ControllerImplement('reversi-local')
export class ReversiLocalController extends Controller {
  initImpl(): void {
    const game: ReversiGame = this.game! as ReversiGame;
    const canvas = (game.deps.get('renderer') as Renderer).screen?.canvas;

    const handleMouseDown = (e: MouseEvent) => {
      const [y, x] = [e.offsetX, e.offsetY];
      const L = (game.deps.get('renderer') as Renderer).screen?.L || 1;
      const [nx, ny] = [(x / L) >> 0, (y / L) >> 0];
      const step = `${game.turn}${nx.toString(36)}${ny.toString(36)}`;

      game.step(step);
    };
    canvas?.addEventListener('mousedown', handleMouseDown);

    game.after.on('stop', () => {
      canvas?.removeEventListener('mousedown', handleMouseDown);
    });
  }
}
