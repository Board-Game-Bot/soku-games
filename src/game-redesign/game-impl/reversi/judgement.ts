import { ReversiGame } from './game';

export class Judgement {
  constructor(game: ReversiGame) {
    game.after.on('step', (s: string) => {
      console.log(s);
    });

    game.after.on('step', () => {
      const { grid, turn, r, c } = game;

      let isEmpty = false;
      const count = [0, 0];
      for (let i = 0; i < r; ++i) {
        for (let j = 0; j < c; ++j) {
          if (grid[i][j] === 2) {
            isEmpty = true;
          } else {
            count[grid[i][j]] += 1;
          }
        }
      }

      // game over
      if (!isEmpty) {
        game.frame();
        if (count[0] !== count[1]) {
          game.stop(`Game over: ${count[0] > count[1] ? 0 : 1}方棋子更多`);
        } else {
          game.stop(`Game over: 双方棋子数相同，平局`);
        }
        return;
      } else if (count.includes(0)) {
        game.frame().stop(`Game over: ${count.indexOf(0)}方棋子蒸发`);
        return;
      }

      let shouldPass = true;
      for (let i = 0; i < r; ++i) {
        for (let j = 0; j < c; ++j) {
          if (game.validateImpl(`${turn}${i.toString(36)}${j.toString(36)}`)) {
            shouldPass = false;
            break;
          }
        }
        if (!shouldPass) {
          break;
        }
      }

      if (shouldPass) {
        game.step('ps');
      }
    });
  }
}
