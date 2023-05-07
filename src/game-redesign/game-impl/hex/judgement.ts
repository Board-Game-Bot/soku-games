import { HexGame } from './game';

const dx = [0, 1, 1, 0, -1, -1];
const dy = [-1, -1, 0, 1, 1, 0];

export class Judgement {
  constructor(game: HexGame) {
    game.after.on('step', (s: string) => {
      const [id, x, y] = [+s[0], parseInt(s[1], 36), parseInt(s[2], 36)];
      const { grid, w } = game;
      const visited = new Array(w).fill(0).map(() => new Array(w).fill(false));

      if (dfs(x, y) === 3) {
        game.frame().stop(`${id}方连接两边`);
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
    });
  }
}
