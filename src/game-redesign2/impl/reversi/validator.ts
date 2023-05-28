import { Validator } from '@/game-redesign2/validator/base';
import { ValidatorImplement } from '@/game-redesign2/validator/decorator';
import { ReversiGame } from './game';

@ValidatorImplement('reversi')
export class ReversiValidator extends Validator {
  checkImpl(s: string): boolean {
    if (s === 'ps') {
      return true;
    }
    if (!/^[0-1][0-9a-zA-Z]{2,2}$/.test(s)) {
      return false;
    }

    const id = +s[0],
      r = parseInt(s[1], 36),
      c = parseInt(s[2], 36);
    const game = this.game! as ReversiGame;
    const { grid, turn, r: row, c: col } = game;

    if (
      turn !== id ||
      r < 0 ||
      row <= r ||
      c < 0 ||
      col <= c ||
      grid[r][c] !== 2
    ) {
      return false;
    }

    for (let i = 0; i < 8; ++i) {
      if (game.checkValidDir(r, c, id, i)) {
        return true;
      }
    }

    return false;
  }

  afterImpl(): void {
    const game = this.game! as ReversiGame;
    const { grid, r: row, c: col } = game;
    const count = [0, 0];
    let isEmpty = false;

    for (let i = 0; i < row; ++i) {
      for (let j = 0; j < col; ++j) {
        if (grid[i][j] === 2) {
          isEmpty = true;
        } else {
          count[grid[i][j]] += 1;
        }
      }
    }

    if (!isEmpty) {
      if (count[0] !== count[1]) {
        game.stop(`${count[0] > count[1] ? 0 : 1}方棋子更多`);
      } else {
        game.stop(`双方棋子数相同，平局`);
      }
      return;
    } else if (count.includes(0)) {
      game.stop(`${count.indexOf(0)}方棋子蒸发`);
      return;
    }
  }
}
