import { DataGenerator } from '@/game-redesign/data.generator';
import { GeneratorImplement } from '@/game-redesign/data.generator.decorator';

const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];

@GeneratorImplement('snake', 1)
export class SnakeDataGenerator extends DataGenerator {
  static do(extra: any) {
    const { r, c, wallCount } = extra;
    function rand(n: number) {
      return (n * Math.random()) >>> 0;
    }

    function make() {
      const g = new Array(r).fill(0).map(() => new Array(c).fill(0));
      for (let i = 0; i < r; ++i) {
        g[i][0] = g[i][c - 1] = 1;
      }
      for (let i = 0; i < c; ++i) {
        g[0][i] = g[r - 1][i] = 1;
      }

      for (let i = 0; i < wallCount; ++i) {
        let x, y;
        while (((x = rand(r)), (y = rand(c)), !!g[x][y]));
        g[x][y] = g[r - 1 - x][c - 1 - y] = 1;
      }

      return g;
    }

    function isIn(x = 0, y = 0) {
      return 0 <= x && x < r && 0 <= y && y < c;
    }

    function check(g: number[][]) {
      const vis = g.map((x) => new Array(x.length).fill(false));
      const q = <[number, number][]>[];

      q.push([r - 2, 1]);
      vis[r - 2][1] = true;
      while (!!q.length) {
        const [x, y] = q.shift()!;
        for (let i = 0; i < 4; ++i) {
          const [nx, ny] = [x + dx[i], y + dy[i]];

          if ([isIn(nx, ny), !vis[nx][ny], !g[nx][ny]].includes(false))
            continue;
          if (nx === 1 && ny === c - 2) {
            return true;
          }

          vis[nx][ny] = true;
          q.push([nx, ny]);
        }
      }
      return false;
    }

    let g;
    do {
      g = make();
    } while (!check(g));

    return {
      rc: (r << 16) | c,
      mask: g.toString().replaceAll(',', ''),
    };
  }
}
