import { IPosition } from '@/game-redesign/c';
import { Controller } from '@/game-redesign/controller.base';
import { GameControllerImplement } from '@/game-redesign/controller.decorator';
import { GomokuGame } from '../game';

@GameControllerImplement('local', 'gomoku', 5)
export class LocalController extends Controller {
  setGame(game: GomokuGame): void {
    super.setGame(game);

    const canvas = game.canvas!;

    const leftFn = (e: MouseEvent) => {
      if (e.button !== 0) return;

      const L = game.L!;
      const p = <IPosition>[
        (e.offsetY / L - 0.5) >> 0,
        (e.offsetX / L - 0.5) >> 0,
      ];
      const turn = game.turn;
      const { row, col } = game;

      if (0 <= p[0] && p[0] < row && 0 <= p[1] && p[1] < col) {
        game.step(`${turn}${p[0].toString(36)}${p[1].toString(36)}`);
      }
    };

    canvas.addEventListener('mousedown', leftFn);
    game.before.on('stop', () => {
      canvas.removeEventListener('mousedown', leftFn);
    });
  }
}
