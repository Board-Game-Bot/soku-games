import { Renderer } from '../../renderer/base';
import { Controller } from '../../controller/base';
import { ControllerImplement } from '../../controller/decorator';
import { SnakeGame } from './game';

const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

@ControllerImplement('snake-local')
export class SnakeController extends Controller {
  initImpl(): void {
    let selected = -1;
    let count = 0;
    const dirs = [-1, -1];
    const game = this.game! as SnakeGame;
    const renderer = game.deps.get('renderer')! as Renderer;
    const { screen } = renderer;
    const { canvas } = screen!;
    const handleMouseDown = (e: MouseEvent) => {
      const { L } = screen!;
      const [x, y] = [(e.offsetY / L) >> 0, (e.offsetX / L) >> 0];

      if (e.button === 0) {
        let i;
        if (
          (i = game.snakes.findIndex(
            (s) => s.cells[0][0] === x && s.cells[0][1] === y
          )) !== -1
        ) {
          selected = i === selected ? -1 : i;
        }
      } else if (e.button === 2) {
        if (selected !== -1) {
          let j;
          const h = game.snakes[selected].cells[0];

          if (
            (j = dx.findIndex(
              (_, d) => h[0] + dx[d] === x && h[1] + dy[d] === y
            )) !== -1
          ) {
            dirs[selected] = j;
            selected = -1;
          }

          if (!dirs.includes(-1)) {
            const isIncreasing = count < 10 || count % 3 === 0;

            ++count;
            game.step(`${dirs[0]}${dirs[1]}${+isIncreasing}`);
            dirs[0] = dirs[1] = -1;
          }
        }
      }
    };
    canvas.addEventListener('mousedown', handleMouseDown);
    game.before.on('stop', () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    });

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    canvas.addEventListener('contextmenu', handleContextMenu);
    game.before.on('stop', () => {
      canvas.removeEventListener('contextmenu', handleContextMenu);
    });
  }
}
