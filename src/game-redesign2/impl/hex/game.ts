import { Game } from '../../game.base';
import { GameImplement } from '../../game.decorator';

type InitData = {
  w: number;
  mask: string;
};

@GameImplement('hex')
export class HexGame extends Game {
  w = 0;
  grid = <number[][]>[];
  initImpl(data: InitData): void {
    const { w, mask } = data;

    this.w = w;

    this.grid = new Array(w).fill(0).map(() => new Array(w).fill(2));
    for (let i = 0, k = 0; i < w; ++i) {
      for (let j = 0; j < w; ++j) {
        this.grid[i][j] = +mask[k++];
      }
    }
  }

  stepImpl(s: string): void {
    '{id}.{r}.{c}';
    const id = +s[0];
    const [r, c] = [parseInt(s[1], 36), parseInt(s[2], 36)];
    this.put(s, id, r, c);
  }

  turn = 0;
  put(s: string, id: number, r: number, c: number) {
    this.grid[r][c] = id;
    this.turn ^= 1;
    this.pushStep(s, () => {
      this.grid[r][c] = 2;
      this.turn ^= 1;
    });
  }
}
