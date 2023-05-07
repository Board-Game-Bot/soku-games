import { GomokuGame } from './game';

const dx = [-1, -1, -1, 0];
const dy = [-1, 0, 1, 1];

export class Judgement {
  constructor(game: GomokuGame) {
    game.after.on('step', (s: string) => {
      const [id, x, y] = [+s[0], parseInt(s[1], 36), parseInt(s[2], 36)];
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
          game.frame().stop(`Game over: ${id}方棋子胜利`);
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
        game.stop('Game over: 双方没有连成，平局');
      }

      function isIn(x = 0, y = 0) {
        return 0 <= x && x < row && 0 <= y && y < col;
      }
    });
  }
}
