import { GameImplement } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
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
    const i = +s[0],
      r = +s[1],
      c = +s[2];

    this.placePiece(r, c, i);
  }

  placePiece(...[r, c, i]: number[]) {
    const grid = this.grid;

    this.grid[r][c] = i;

    let row = this.r,
      col = this.c;

    for (let j = 0; j < 8; ++j) {
      if (checkValidDir(j)) {
        reverse(j);
      }
    }

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
        (x += dx[d]), (y += dy[d]);
      }
    }

    function isIn(x = 0, y = 0) {
      return 0 <= x && x < row && 0 <= y && y < col;
    }
  }
}
