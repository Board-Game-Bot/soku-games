import { HexGame } from './game';
import { Controller } from '../../controller/base';
import { ControllerImplement } from '../../controller/decorator';
import { Renderer } from '../../renderer/base';
import { C, IPosition, Vector } from '../../utils/c';

@ControllerImplement('hex-local')
export class HexController extends Controller {
  initImpl(): void {
    const game = this.game! as HexGame;
    const renderer = game.deps.get('renderer') as Renderer;
    const canvas = renderer.screen?.canvas;

    const handleMouseDown = (e: MouseEvent) => {
      const L = renderer.screen?.L || 1;
      const [ry, rx] = [e.offsetX / L, e.offsetY / L];
      const p = findPosition(rx, ry);

      if (!p) {
        return;
      }

      const [x, y] = p;
      const step = `${game.turn}${x.toString(36)}${y.toString(36)}`;

      game.step(step);
    };
    canvas?.addEventListener('mousedown', handleMouseDown);
    game.before.on('stop', () => {
      canvas?.removeEventListener('mousedown', handleMouseDown);
    });
  }
}

export function getPosition(x: number, y: number) {
  const vx = new Vector(1.732, 0);
  const vy = new Vector(1.732, 0);
  vx.rot(Math.PI / 6);
  vy.rot(-Math.PI / 6);
  vx.mul(x);
  vy.mul(y);
  return vx.add(vy).add(new Vector(1, 10));
}

export function findPosition(x: number, y: number) {
  let ret: IPosition | undefined;

  for (let i = 0; i < 11; ++i) {
    for (let j = 0; j < 11; ++j) {
      const p = getPosition(i, j);
      const d = C.distance([p.x, p.y], [x, y]);

      if (d < 0.8) ret = [i, j];
    }
  }

  return ret;
}
