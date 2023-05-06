import { C } from '../../utils/c';
import { Game } from '../../game.base';
import { GameObject } from '../../game.object';
import { IPosition } from './game';

const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

export class Snake extends GameObject {
  constructor(game: Game) {
    super(game);

    this.mkUpdater('render-body', () => {
      const L = this.L!;
      const g = game.g;
      this.cells.reduce((pre, cur) => {
        const [dx, dy] = [pre[0] - cur[0], pre[1] - cur[1]];
        if (!!dx) {
          g?.Rect({
            y: (Math.min(pre[0], cur[0]) + 0.5) * L,
            x: (pre[1] + 0.1) * L,
            ly: Math.abs(dx) * L,
            lx: 0.8 * L,
            color: this.color,
          });
        } else {
          g?.Rect({
            y: (pre[0] + 0.1) * L,
            x: (Math.min(pre[1], cur[1]) + 0.5) * L,
            ly: 0.8 * L,
            lx: Math.abs(dy) * L,
            color: this.color,
          });
        }
        return cur;
      });
    });
    this.mkUpdater('render-cells', () => {
      const L = this.L!;
      const g = game.g;

      this.cells.forEach((c) => {
        const [x, y] = c;
        g?.Cir({
          x: (y + 0.5) * L,
          y: (x + 0.5) * L,
          radius: 0.4 * L,
          color: this.color,
        });
      });
      const [x, y] = this.cells[0];
      g?.Cir({
        x: (y + 0.5) * L,
        y: (x + 0.5) * L,
        radius: 0.2 * L,
        color: '#000',
      });
    });

    const fn = () => {
      if (!this.stepMq.length) return;
      this.next(...this.stepMq.shift()!);
    };
    let mqTimer = setInterval(fn, 200);
    document.addEventListener('visibilitychange', () => {
      if (this.destroyed) return;
      if (document.visibilityState === 'hidden') {
        clearInterval(mqTimer);
      } else {
        mqTimer = setInterval(fn, 200);
      }
    });
    this.before.on('destroy', () => {
      clearInterval(mqTimer);
    });
  }

  cells = <IPosition[]>[];
  color = '';
  init(pos: IPosition, color: string) {
    this.cells.push(pos);
    this.color = color;
    return this;
  }

  stepMq = <[number, boolean, boolean][]>[];
  toNext(d: number, incr: boolean, dir: boolean) {
    this.stepMq.push([d, incr, dir]);
  }

  stateStack = <IPosition[][]>[];
  next(d: number, incr: boolean, dir: boolean) {
    if (!dir) {
      this.stateStack.push(this.cells.slice(0));

      const [hx, hy] = this.cells[0];
      const nextCell = <IPosition>[hx + dx[d], hy + dy[d]];
      const newH = <IPosition>[...this.cells[0]];

      this.cells = [newH, ...this.cells.slice(0)];

      this.mkUpdater('moving', (dt: number) => {
        const [hx, hy] = this.cells[0];
        const [nx, ny] = nextCell;
        const [dx, dy] = [nx - hx, ny - hy];
        const distance = C.distance(nextCell, this.cells[0]);
        const moveDistance = 10 /**speed */ * dt;
        if (distance < moveDistance) {
          this.cells[0] = nextCell;
          if (!incr) {
            this.cells.pop();
          }
          this.rmUpdater('moving');
        } else {
          newH[0] += moveDistance * dx;
          newH[1] += moveDistance * dy;
          if (!incr) {
            const tail = this.cells.at(-1)!;
            const tailTarget = this.cells.at(-2)!;
            const [dx, dy] = [tailTarget[0] - tail[0], tailTarget[1] - tail[1]];
            tail[0] += (moveDistance * dx) / distance;
            tail[1] += (moveDistance * dy) / distance;
          }
        }
      });
    } else {
      this.rmUpdater('moving');
      this.cells = this.stateStack.pop()!;
    }
  }
}
