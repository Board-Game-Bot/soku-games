import { Generator, GeneratorImpl } from '@soku-games/core';

@GeneratorImpl('reversi')
export class ReversiGenerator extends Generator {
  generate(r = 8, c = 8): string {
    const grid = Array(r)
      .fill(0)
      .map(() => Array(c).fill(2));

    grid[r >> 1][(c >> 1) - 1] = grid[(r >> 1) - 1][c >> 1] = 0;
    grid[r >> 1][c >> 1] = grid[(r >> 1) - 1][(c >> 1) - 1] = 1;

    return `${r} ${c} ${grid.map((row) => row.join('')).join('')}`;
  }
}
