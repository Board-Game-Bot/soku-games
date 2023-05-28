import { Controller } from '../../controller/base';
import { ControllerImplement } from '../../controller/decorator';
import { BackgammonGame } from './game';
import { Renderer } from '../../renderer/base';
import { Piece } from './piece';

@ControllerImplement('backgammon-local')
export class BackgammonLocalController extends Controller {
  initImpl(): void {
    const game = this.game! as BackgammonGame;
    const screen = (game.deps.get('renderer') as Renderer).screen!;
    const { canvas } = screen;

    let current: Piece | null = null;
    let currentId = -1;
    const handleLeft = (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }

      const { L } = screen;
      const { offsetX: x, offsetY: y } = e;
      const id = p2id((y / L) >> 0, (x / L) >> 0);

      let selectedPiece: Piece | null;
      if (id === -1 || game.pieces[id].length === 0) {
        selectedPiece = null;
        currentId = -1;
      } else {
        selectedPiece = game.pieces[id].at(-1)!;
        currentId = id;
      }
      if (current) {
        current.isSelected = false;
      }
      current = selectedPiece;
      if (current) {
        current.isSelected = true;
      }
    };

    canvas.addEventListener('mousedown', handleLeft);
    game.after.on('stop', () => {
      canvas.removeEventListener('mousedown', handleLeft);
    });

    const handleRight = (e: MouseEvent) => {
      if (e.button !== 2) return;
      if (!current) return;

      const { offsetX: x, offsetY: y } = e;
      const { L } = screen;
      const id = p2id((y / L) >> 0, (x / L) >> 0);

      if (id === -1 || !current) return;
      game.step(`v${currentId.toString(36)}${id.toString(36)}`);

      current.isSelected = false;
      current = null;
      currentId = -1;
    };

    canvas.addEventListener('mousedown', handleRight);
    game.before.on('stop', () => {
      canvas.removeEventListener('mousedown', handleRight);
    });

    const contextMenuFn = (e: MouseEvent) => {
      e.preventDefault();
    };
    canvas.addEventListener('contextmenu', contextMenuFn);
    game.before.on('stop', () => {
      canvas.removeEventListener('contextmenu', contextMenuFn);
    });
  }
}

function p2id(...p: [number, number]): number {
  const [x, y] = p;
  if (x < 5) {
    if (y < 6) {
      return 12 - y;
    } else if (6 < y && y < 13) {
      return 13 - y;
    } else if (y === 6) {
      return 0;
    } else return 27;
  } else if (x > 5) {
    if (y < 6) return 13 + y;
    else if (6 < y && y < 13) return 12 + y;
    else if (y === 6) return 25;
    else return 26;
  } else {
    return -1;
  }
}
