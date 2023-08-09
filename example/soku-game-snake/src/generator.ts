import { Generator, GeneratorImpl } from '@soku-games/core';
import { deepClone } from './util';
import { dir } from './constants';

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

  function oneGenerate() {
    const newGrid = deepClone(grid);
    let _wc = wc;

    while (_wc) {
      const [x, y] = step();
      if (!newGrid[x][y]) {
        --_wc;
        newGrid[x][y] = newGrid[r - 1 - x][c - 1 - y] = 1;
      }
    }

    for (let i = 0; i < r; ++i) {
      newGrid[i][0] = newGrid[i][c - 1] = 1;
    }

    for (let i = 0; i < c; ++i) {
      newGrid[0][i] = newGrid[r - 1][i] = 1;
    }

    return newGrid;
  }

  function checkConnection(grid: number[][]) {
    if (grid[r - 2][1]) {
      return false;
    }
    const count = (() => {
      let cnt = 0;
      for (let i = 0; i < r; ++i) {
        for (let j = 0; j < c; ++j) {
          cnt += +(grid[i][j] === 0);
        }
      }
      return cnt;
    })();
    const actualCount = floodFill(grid, [r - 2, 1]);

    return actualCount === count;
  }

  let result: number[][];
  do {
    result = oneGenerate();
  } while (!checkConnection(result));

  return result;
}

function floodFill(data: number[][], st: [number, number]): number {
  const grid = deepClone(data);
  const q: [number, number][] = [];

  let cnt = 1;
  grid[st[0]][st[1]] = 1;
  q.push(st);

  while (q.length) {
    const u = [...q.pop()!];
    for (let i = 0; i < 4; ++i) {
      const v = [u[0] + dir[0][i], u[1] + dir[1][i]];
      if (grid[v[0]][v[1]]) {
        continue;
      }
      grid[v[0]][v[1]] += 1;
      cnt += 1;
      q.push(v as [number, number]);
    }
  }

  return cnt;
}
