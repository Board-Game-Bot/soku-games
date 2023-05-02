import { GameImplement } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { GameMap } from './map';
import { Snake } from './snake';

export type IPosition = [number, number];

@GameImplement('snake', 1)
export class SnakeGame extends Game {
  constructor() {
    super();

    this.before.on('start', () => {
      new GameMap(this);
    });
  }

  rows = 0;
  cols = 0;
  grid = <number[][]>[];
  snakes = <Snake[]>[];
  initImpl(data: any): void {
    let { rc } = data;
    let k = 0;
    const { mask } = data;

    this.cols = rc & ((1 << 16) - 1);
    rc >>= 16;
    this.rows = rc & ((1 << 16) - 1);
    this.screen?.config([this.cols, this.rows]);
    this.grid = new Array(this.rows)
      .fill(0)
      .map(() => new Array(this.cols).fill(0))
      .map((x) => x.map(() => +mask[k++]));
    this.snakes = [
      new Snake(this).init([1, this.cols - 2], '#f00'),
      new Snake(this).init([this.rows - 2, 1], '#00f'),
    ];
  }

  stepImpl(s: string): void {
    'd0.d1.incr';
    const d = [+s[0], +s[1]];
    const incr = !!+s[2];
    [0, 1].forEach((i) => {
      this.snakes[i].toNext(d[i], incr, false);
    });
    this.pushStep(s, () => {
      [0, 1].forEach((i) => {
        this.snakes[i].toNext(d[i], incr, true);
      });
    });
  }
}
