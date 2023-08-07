import { Validator } from '../../validator/base';
import { ValidatorImplement } from '../../validator/decorator';
import { HexGame } from './game';

const dx = [0, 1, 1, 0, -1, -1];
const dy = [-1, -1, 0, 1, 1, 0];

@ValidatorImplement('hex')
export class HexValidator extends Validator {
  checkImpl(s: string): boolean {
    if (!/^[0-1][0-9a-zA-Z]{2}$/.test(s)) {
      return false;
    }

    const [id, r, c] = [+s[0], parseInt(s[1], 36), parseInt(s[2], 36)];
    const game = this.game! as HexGame;

    if (id !== game.turn) {
      return false;
    }

    if (!this.isIn(r) || !this.isIn(c)) {
      return false;
    }

    if (game.grid[r][c] !== 2) {
      return false;
    }

    return true;
  }

  afterImpl(s: string): void {
    const [id, x, y] = [+s[0], parseInt(s[1], 36), parseInt(s[2], 36)];
    const game = this.game! as HexGame;
    const { grid, w } = game;
    const visited = new Array(w).fill(0).map(() => new Array(w).fill(false));

    if (dfs(x, y) === 3) {
      setTimeout(() => {
        game.stop(`${id}方连接两边`);
      });
    }

    function dfs(x = 0, y = 0) {
      visited[x][y] = true;
      let res = 0;

      if ((id === 0 && x === 0) || (id === 1 && y === 0)) {
        res |= 1;
      }
      if ((id === 0 && x === w - 1) || (id === 1 && y === w - 1)) {
        res |= 2;
      }
      for (let i = 0; i < 6; ++i) {
        const nx = x + dx[i];
        const ny = y + dy[i];

        if (isIn(nx, ny) && !visited[nx][ny] && grid[nx][ny] === id) {
          res |= dfs(nx, ny);
        }
      }

      visited[x][y] = false;
      return res;
    }

    function isIn(x = 0, y = 0) {
      return 0 <= x && x < w && 0 <= y && y < w;
    }
  }

  isIn(x: number) {
    return 0 <= x && x < (this.game as HexGame).w;
  }
}
