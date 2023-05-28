import { GameImplement } from '@/game-redesign2/game.decorator';
import { Game } from '../../game.base';
import { IPosition } from '@/game-redesign2/utils/c';

const dx = [-1, -1, -1, 0, 1, 1, 1, 0];
const dy = [-1, 0, 1, 1, 1, 0, -1, -1];

@GameImplement('reversi')
export class ReversiGame extends Game {
  grid = <number[][]>[];
  r = 0;
  c = 0;
  turn = 0;
  initImpl(data: { rc: number; mask: string }): void {
    let { rc } = data;
    const { mask } = data;
    let k = 0;

    const c = rc & ((1 << 16) - 1);
    rc >>= 16;
    const r = rc;

    this.r = r;
    this.c = c;

    this.grid = new Array(r).fill(0).map(() => new Array(c));

    for (let i = 0; i < r; ++i) {
      for (let j = 0; j < c; ++j) {
        this.grid[i][j] = +mask[k++];
      }
    }
  }

  stepImpl(s: string): void {
    'i.r.c';
    'ps';
    if (s === 'ps') {
      return this.pass();
    }

    const i = +s[0],
      r = parseInt(s[1], 36),
      c = parseInt(s[2], 36);

    this.placePiece(s, r, c, i);
  }

  lastPlace: IPosition | null = null;
  placePiece(s: string, ...[r, c, i]: number[]) {
    const grid = this.grid;
    const oldLastPlace = !!this.lastPlace
      ? <IPosition>[...this.lastPlace]
      : null;

    this.grid[r][c] = i;
    this.lastPlace = [r, c];

    let row = this.r,
      col = this.c;

    let changedPieces: number[][] | null = [];

    for (let j = 0; j < 8; ++j) {
      if (this.checkValidDir(r, c, i, j)) {
        reverse(j);
      }
    }

    this.turn ^= 1;

    this.pushStep(s, () => {
      this.grid[r][c] = 2;
      this.lastPlace = oldLastPlace;
      changedPieces!.forEach(([x, y]) => {
        this.grid[x][y] = 1 - i;
      });
      changedPieces = null;
      this.turn ^= 1;
    });

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

  checkValidDir(r: number, c: number, id: number, d = 0) {
    const grid = this.grid;
    const row = this.r;
    const col = this.c;
    let x = r + dx[d],
      y = c + dy[d];
    let flg = false;

    while (isIn(x, y) && grid[x][y] === 1 - id) {
      flg = true;
      (x += dx[d]), (y += dy[d]);
    }
    if (!isIn(x, y) || grid[x][y] === 2 || !flg) {
      return false;
    }
    function isIn(x = 0, y = 0) {
      return 0 <= x && x < row && 0 <= y && y < col;
    }

    return true;
  }

  pass() {
    this.turn ^= 1;

    this.pushStep('p', () => {
      this.turn ^= 1;
    });
  }
}
