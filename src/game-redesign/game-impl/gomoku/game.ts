import { GameImplement } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { Renderer } from './renderer';
import { IPosition } from '@/game-redesign/c';

@GameImplement('gomoku', 5)
export class GomokuGame extends Game {
  constructor() {
    super();

    this.before.on('start', () => {
      new Renderer(this);
    });
  }

  row = 0;
  col = 0;
  grid = <number[][]>[];
  initImpl(data: { rc: number; mask: string }): void {
    const { mask } = data;
    let { rc } = data;

    this.col = rc & ((1 << 16) - 1);
    rc >>= 16;
    this.row = rc;

    this.grid = new Array(this.row)
      .fill(0)
      .map(() => new Array(this.col).fill(2));
    for (let i = 0, k = 0; i < this.row; ++i) {
      for (let j = 0; j < this.col; ++j) {
        this.grid[i][j] = +mask[k++];
      }
    }

    this.screen?.config([this.col + 1, this.row + 1]);
  }

  turn = 0;
  lastPut = <IPosition[]>[];
  stepImpl(s: string): void {
    '{id}.{r}.{c}';
    const id = +s[0];
    const r = parseInt(s[1], 36);
    const c = parseInt(s[2], 36);

    this.grid[r][c] = id;
    this.turn ^= 1;
    this.lastPut.push([r, c]);

    this.pushStep(s, () => {
      this.grid[r][c] = 2;
      this.turn ^= 1;
      this.lastPut.pop();
    });
  }
}
