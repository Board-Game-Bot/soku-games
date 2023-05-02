import { GameImplement } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { Renderer } from './renderer';
import { Vector } from '@/game-redesign/g';

@GameImplement('hex', 4)
export class HexGame extends Game {
  constructor() {
    super();

    this.before.on('start', () => {
      new Renderer(this);
    });
  }

  grid = <number[][]>[];
  w = 0;
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

  put(s: string, ...[id, r, c]: number[]) {
    this.grid[r][c] = id;
    this.pushStep(s, () => {
      this.grid[r][c] = 2;
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
