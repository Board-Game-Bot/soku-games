import { HexGame } from './game';
import { Renderer } from '../../renderer/base';
import { RendererImplement } from '../../renderer/decorator';
import { C, IPosition, Vector } from '../../utils/c';

@RendererImplement('hex')
export class HexRenderer extends Renderer {
  initImpl(): void {
    const screen = this.screen!;
    const game = this.game! as HexGame;
    const { w } = game;
    const [r, c] = [3 * w - 1, Math.ceil(Math.sqrt(3) * w)];

    screen.setAspectRatio(c, r);

    this.rendererMap.set('render-bg', () => {
      const { g } = screen;

      g.Rect({
        y: 0,
        x: 0,
        ly: r,
        lx: c,
        color: '#cca',
      });
    });

    let currentPosition: IPosition | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      const { L } = screen;
      const p = findPosition(e.offsetY / L, e.offsetX / L);

      if (!p) {
        return;
      }

      currentPosition = p;
    };
    screen.canvas.addEventListener('mousemove', handleMouseMove);
    game.before.on('stop', () => {
      screen.canvas.removeEventListener('mousedown', handleMouseMove);
    });

    this.rendererMap.set('render-current', () => {
      const { g } = screen;

      if (!currentPosition) {
        return;
      }

      const [cx, cy] = currentPosition;
      const { x, y } = getPosition(cx, cy);

      g.Hex({
        x,
        y,
        radius: 0.6,
        color: game.turn ? '#008' : '#800',
      });
    });

    this.rendererMap.set('render-grid', () => {
      const { g } = screen;
      const { w, grid } = game;

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < w; ++j) {
          const { x, y } = getPosition(i, j);

          g.StrokeHex({
            x,
            y,
            radius: 1,
            width: 0.1,
            color: '#222',
          });

          if (grid[i][j] !== 2) {
            g.Hex({
              x,
              y,
              radius: 0.7,
              color: grid[i][j] ? '#008' : '#800',
            });
          }
        }
      }
    });

    this.rendererMap.set('render-border', () => {
      const { g } = screen;
      let lst: [number, number][] = [];

      for (let idx = 0; idx < 11; ++idx) {
        lst.push(
          [10 + idx * 0.866, idx * 1.5],
          [10 + (idx + 1) * 0.866, 0.5 + idx * 1.5]
        );
      }
      lst.push([19.526, 16]);
      g.Segs({
        ps: lst,
        width: 0.2,
        color: '#800',
      });
      lst = [];

      for (let idx = 0; idx < 11; ++idx) {
        lst.push(
          [10 - idx * 0.866, 32 - idx * 1.5],
          [10 - (idx + 1) * 0.866, 32 - 0.5 - idx * 1.5]
        );
      }
      lst.push([0.474, 16]);
      g.Segs({
        ps: lst,
        width: 0.2,
        color: '#800',
      });
      lst = [];
      for (let i = 0; i < 11; ++i) {
        lst.push(
          [10 + i * 0.866, 32 - i * 1.5],
          [10 + (i + 1) * 0.866, 32 - 0.5 - i * 1.5]
        );
      }
      lst.push([19.526, 16]);
      g.Segs({
        ps: lst,
        width: 0.2,
        color: '#00f',
      });
      lst = [];
      for (let i = 0; i < 11; ++i) {
        lst.push(
          [10 - i * 0.866, i * 1.5],
          [10 - (i + 1) * 0.866, 0.5 + i * 1.5]
        );
      }
      lst.push([0.474, 16]);
      g.Segs({
        ps: lst,
        width: 0.2,
        color: '#00f',
      });
    });

    this.rendererMap.set('render-first', () => {
      const { g } = screen;
      const { x, y } = getPosition(1, 2);

      g.StrokeHex({
        x,
        y,
        radius: 0.7,
        width: 0.3,
        color: '#765',
      });
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
