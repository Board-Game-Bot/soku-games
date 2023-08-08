import { Generator, GeneratorImpl } from '@soku-games/core';

@GeneratorImpl('snake')
export class SnakeGenerator extends Generator {
  generate(...args: any[]): string {
    const [r, c, wallCount] = args as number[];
    const grid = Array(r)
      .fill(0)
      .map(() => Array(c).fill(0));

    generate(grid, wallCount);

    return `${r} ${c} ${grid.toString().replace(/,/g, '')}`;
  }
}

function generate(grid: number[][], wc: number) {
  const r = grid.length;
  const c = grid[0].length;

  function step() {
    const rr = (Math.random() * r) | 0;
    const cc = (Math.random() * c) | 0;
    return [rr, cc];
  }
  while (wc) {
    const [x, y] = step();
    if (!grid[x][y]) {
      --wc;
      grid[x][y] = grid[r - 1 - x][c - 1 - y] = 1;
    }
  }

  for (let i = 0; i < r; ++i) {
    grid[i][0] = grid[i][c - 1] = 1;
  }

  for (let i = 0; i < c; ++i) {
    grid[0][i] = grid[r - 1][i] = 1;
  }
}
