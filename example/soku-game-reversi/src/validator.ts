import { ReversiGame } from './game';
import { checkBetween, checkGameOver, checkPass, isIn } from './utils';
import { GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';

export enum ReversiEvent {
  PASS = 'pass',
}

@GamePluginImpl('reversi-validator')
export class ReversiValidator extends GamePlugin {
  bindGame(game: ReversiGame): void {
    let turn = 0;
    game.checkStep((stepStr) => {
      const id = +stepStr[0];

      return id === turn ? '' : 'Not the correct turn.';
    });
    game.checkStep((stepStr) => {
      const [, x, y] = stepStr.split('').map((x) => parseInt(x, 36));
      const { r, c } = game.data;

      return isIn(r, c, x, y) ? '' : 'Out of the size.';
    });
    game.checkStep((stepStr) => {
      const [, x, y] = stepStr.split('').map((x) => parseInt(x, 36));
      const { grid } = game.data;

      return grid[x][y] === 2 ? '' : 'There is already has a chess.';
    });
    game.checkStep((stepStr) => {
      const [id, x, y] = stepStr.split('').map((x) => parseInt(x, 36));

      return checkBetween(game.data.grid, id, x, y)
        ? ''
        : "You can' place a disk on this position.";
    });
    game.subscribe(LifeCycle.BEFORE_STEP, (stepStr) => {
      // 有棋子翻面？
      if (!/^\d{3}$/.test(stepStr)) {
        return;
      }
    });
    game.subscribe(LifeCycle.AFTER_STEP, () => {
      turn ^= 1;
      // 检查游戏结束？跳过？
      let result = '';
      if ((result = checkGameOver(game.data.grid))) {
        setTimeout(() => game.end(result));
        return;
      }
      if (checkPass(game.data.grid, turn)) {
        turn ^= 1;
        game.publish(ReversiEvent.PASS, turn);
      }
    });
  }
}
