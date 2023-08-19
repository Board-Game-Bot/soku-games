import { Generator, GeneratorImpl } from '@soku-games/core';

@GeneratorImpl('reversi')
export class ReversiGenerator extends Generator {
  generate(...args: any[]): string {
    const [r, c] = args as [number, number];
    const grid = Array(r)
      .fill(0)
      .map(() => Array(c).fill(2));

    grid[r >> 1][(c >> 1) - 1] = grid[(r >> 1) - 1][c >> 1] = 0;
    grid[r >> 1][c >> 1] = grid[(r >> 1) - 1][(c >> 1) - 1] = 1;

    return `${r} ${c} ${grid.map((row) => row.join('')).join('')}`;
  }
}
