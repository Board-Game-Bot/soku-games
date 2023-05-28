import { Validator } from '../../validator/base';
import { ValidatorImplement } from '../../validator/decorator';
import { GomokuGame } from './game';

const dx = [-1, -1, -1, 0];
const dy = [-1, 0, 1, 1];
@ValidatorImplement('gomoku')
export class GomokuValidator extends Validator {
  checkImpl(s: string): boolean {
    if (!/^[0-1][0-9a-zA-Z]{2}$/.test(s)) {
      return false;
    }

    const game = this.game! as GomokuGame;
    const [id, x, y] = s.split('').map((x) => parseInt(x, 36));
    const { row, col, grid } = game;

    if (id !== game.turn) {
      return false;
    }

    if (!isIn(x, y)) {
      return false;
    }

    if (grid[x][y] !== 2) {
      return false;
    }

    return true;

    function isIn(x = 0, y = 0) {
      return 0 <= x && x < row && 0 <= y && y < col;
    }
  }

  afterImpl(s: string): void {
    const game = this.game! as GomokuGame;
    const [id, x, y] = s.split('').map((x) => parseInt(x, 36));
    const { row, col, grid } = game;

    for (let i = 0; i < 8; ++i) {
      let nx = x + dx[i];
      let ny = y + dy[i];

      while (isIn(nx, ny) && grid[nx][ny] === id) {
        nx += dx[i];
        ny += dy[i];
      }
      nx -= dx[i];
      ny -= dy[i];

      let count = 0;

      while (isIn(nx, ny) && grid[nx][ny] === id) {
        count++;
        nx -= dx[i];
        ny -= dy[i];
      }
      if (count >= 5) {
        setTimeout(() => {
          game.stop(`${id}方棋子胜利`);
        });
        return;
      }
    }

    let hasEmpty = false;

    for (let i = 0; i < row; ++i) {
      for (let j = 0; j < col; ++j) {
        if (grid[i][j] === 2) {
          hasEmpty = true;
          break;
        }
      }
      if (hasEmpty) {
        break;
      }
    }

    if (!hasEmpty) {
      game.stop('双方没有连成，平局');
    }

    function isIn(x = 0, y = 0) {
      return 0 <= x && x < row && 0 <= y && y < col;
    }
  }
}
