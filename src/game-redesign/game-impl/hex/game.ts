import { C } from '../../utils/c';
import { Vector } from '../../utils/g';
import { GameImplement } from '../../game-implement.decorator';
import { Game } from '../../game.base';
import { IPosition } from '../snake/game';
import { Renderer } from './renderer';

@GameImplement('hex', 4)
export class HexGame extends Game {
  constructor() {
    super();
  }
  addRendererImpl(): void {
    this.before.on('start', () => {
      new Renderer(this);
    });
  }
  grid = <number[][]>[];
  w = 0;
  turn = 0;
  currentPosition: number[] | null = null;
  initImpl(data: { w: number; mask: string }): void {
    const { w, mask } = data;

    this.w = w;

    this.grid = new Array(w).fill(0).map(() => new Array(w).fill(2));
    for (let i = 0, k = 0; i < w; ++i) {
      for (let j = 0; j < w; ++j) {
        this.grid[i][j] = +mask[k++];
      }
    }

    this.screen?.config([20, 32]);
  }

  stepImpl(s: string): void {
    '{id}.{r}.{c}';
    const id = +s[0];
    const [r, c] = [parseInt(s[1], 36), parseInt(s[2], 36)];
    this.put(s, id, r, c);
  }
  validateImpl(s: string): boolean {
    if (!/^[0-1][0-9a-zA-Z]{2,2}$/.test(s)) return false;

    const id = +s[0];
    const [r, c] = [parseInt(s[1], 36), parseInt(s[2], 36)];

    if (this.turn !== id) return false;
    if (r < 0 || this.w <= r || (c < 0 && this.w <= c)) return false;
    if (this.grid[r][c] !== 2) return false;

    return true;
  }

  put(s: string, ...[id, r, c]: number[]) {
    this.grid[r][c] = id;
    this.turn ^= 1;
    this.pushStep(s, () => {
      this.grid[r][c] = 2;
      this.turn ^= 1;
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
  new Array(11).fill(0).forEach((_, i) => {
    new Array(11).fill(0).forEach((_, j) => {
      const p = getPosition(i, j);
      const d = C.distance([p.x, p.y], [x, y]);
      if (d < 0.8) ret = [i, j];
    });
  });
  return ret;
}
