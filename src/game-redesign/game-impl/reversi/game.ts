import { GameImplement } from '../../game-implement.decorator';
import { Game } from '../../game.base';
import { GameMap } from './map';

const dx = [-1, -1, -1, 0, 1, 1, 1, 0];
const dy = [-1, 0, 1, 1, 1, 0, -1, -1];

@GameImplement('reversi', 2)
export class ReversiGame extends Game {
  constructor() {
    super();

    this.before.on('start', () => {
      new GameMap(this);
    });
  }

  grid = <number[][]>[];
  r = 0;
  c = 0;
  initImpl(data: { rc: number; mask: string }): void {
    let { rc } = data;
    const { mask } = data;
    let k = 0;

    const c = rc & ((1 << 16) - 1);
    rc >>= 16;
    const r = rc;

    this.r = r;
    this.c = c;
    this.screen?.config([c, r]);

    this.grid = new Array(r).fill(0).map(() => new Array(c));

    for (let i = 0; i < r; ++i) {
      for (let j = 0; j < c; ++j) {
        this.grid[i][j] = +mask[k++];
      }
    }
  }
  stepImpl(s: string): void {
    'i.r.c';
    'p';
    if (s === 'p') return this.pass();
    const i = +s[0],
      r = parseInt(s[1], 36),
      c = parseInt(s[2], 36);

    this.placePiece(s, r, c, i);
  }

  turn = 0;
  placePiece(s: string, ...[r, c, i]: number[]) {
    const grid = this.grid;

    this.grid[r][c] = i;

    let row = this.r,
      col = this.c;

    let changedPieces: number[][] | null = [];

    for (let j = 0; j < 8; ++j) {
      if (checkValidDir(j)) {
        reverse(j);
      }
    }

    this.turn ^= 1;

    this.pushStep(s, () => {
      this.grid[r][c] = 2;
      changedPieces!.forEach(([x, y]) => {
        this.grid[x][y] = 1 - i;
      });
      changedPieces = null;
      this.turn ^= 1;
    });

    function checkValidDir(d = 0) {
      let x = r + dx[d],
        y = c + dy[d];
      let flg = false;
      while (isIn(x, y) && grid[x][y] === 1 - i) {
        flg = true;
        (x += dx[d]), (y += dy[d]);
      }
      if (!isIn(x, y) || grid[x][y] === 2 || !flg) {
        return false;
      }
      return true;
    }

    function reverse(d = 0) {
      let x = r + dx[d],
        y = c + dy[d];
      while (isIn(x, y) && grid[x][y] === 1 - i) {
        grid[x][y] = i;
        changedPieces!.push([x, y]);
        (x += dx[d]), (y += dy[d]);
      }
    }

    function isIn(x = 0, y = 0) {
      return 0 <= x && x < row && 0 <= y && y < col;
    }
  }

  pass() {
    this.turn ^= 1;

    this.pushStep('p', () => {
      this.turn ^= 1;
    });
  }
}
