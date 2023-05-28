import { Game } from '../../game/base';
import { GameImplement } from '../../game/decorator';
import { Snake } from './extra/snake';

type InitData = {
  rc: number;
  mask: string;
};

@GameImplement('snake')
export class SnakeGame extends Game {
  rows = 0;
  cols = 0;
  grid = <number[][]>[];
  snakes = <Snake[]>[];
  initImpl(data: InitData): void {
    let { rc } = data;
    let k = 0;
    const { mask } = data;

    this.cols = rc & ((1 << 16) - 1);
    rc >>= 16;
    this.rows = rc & ((1 << 16) - 1);
    this.grid = new Array(this.rows)
      .fill(0)
      .map(() => new Array(this.cols).fill(0))
      .map((x) => x.map(() => +mask[k++]));
    this.snakes = [
      new Snake().init([1, this.cols - 2]),
      new Snake().init([this.rows - 2, 1]),
    ];
  }

  stepImpl(s: string): void {
    'd0.d1.incr';
    const d = [+s[0], +s[1]];
    const incr = !!+s[2];

    [0, 1].forEach((i) => {
      this.snakes[i].next(d[i], incr);
    });
    this.pushStep(s, () => {
      [0, 1].forEach((i) => {
        this.snakes[i].rev();
      });
    });
  }
}
