import { Renderer } from '../../renderer/base';
import { Controller } from '../../controller/base';
import { ControllerImplement } from '../../controller/decorator';
import { GomokuGame } from './game';

@ControllerImplement('gomoku-local')
export class GomokuController extends Controller {
  initImpl(): void {
    const game = this.game! as GomokuGame;
    const renderer = game.deps.get('renderer') as Renderer;
    const screen = renderer.screen!;
    const { canvas } = screen;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }

      const L = screen.L;
      const p = [(e.offsetY / L - 0.5) >> 0, (e.offsetX / L - 0.5) >> 0];
      const { turn, row, col } = game;

      if (0 <= p[0] && p[0] < row && 0 <= p[1] && p[1] < col) {
        game.step(`${turn}${p[0].toString(36)}${p[1].toString(36)}`);
      }
    };
    canvas.addEventListener('mousedown', handleMouseDown);
    game.before.on('stop', () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    });
  }
}
