import { Validator, ValidatorImpl } from '@soku-games/core';
import { ReversiGame } from './game';
import { checkBetween, checkGameOver, checkPass, isIn } from './utils';

@ValidatorImpl('reversi')
export class ReversiValidator extends Validator {
  bindGame(game: ReversiGame): void {
    let turn = 0;

    game.stepCheck((stepStr) => {
      const id = +stepStr[0];

      return id === turn ? '' : 'Not the correct turn.';
    });
    game.stepCheck((stepStr) => {
      const [, x, y] = stepStr.split('').map((x) => parseInt(x, 36));
      const { r, c } = game.data;

      return isIn(r, c, x, y) ? '' : 'Out of the size.';
    });
    game.stepCheck((stepStr) => {
      const [, x, y] = stepStr.split('').map((x) => parseInt(x, 36));
      const { grid } = game.data;

      return grid[x][y] === 2 ? '' : 'There is already has a chess.';
    });
    game.stepCheck((stepStr) => {
      const [id, x, y] = stepStr.split('').map((x) => parseInt(x, 36));

      return checkBetween(game.data.grid, id, x, y)
        ? ''
        : "You can' place a disk on this position.";
    });

    game.beforeStep((stepStr) => {
      // 有棋子翻面？
      if (!/^\d{3}$/.test(stepStr)) {
        return;
      }
    });

    game.afterStep(() => {
      turn ^= 1;
      // 检查游戏结束？跳过？
      let result = '';
      if ((result = checkGameOver(game.data.grid))) {
        setTimeout(() => {
          game.end(result);
        });
        return;
      }

      if (checkPass(game.data.grid, turn)) {
        turn ^= 1;
        game.customEmit('pass', turn);
      }
    });
  }
}
