import { dir } from './constants';

export function isIn(...[r, c, x, y]: number[]) {
  return 0 <= x && x < r && 0 <= y && y < c;
}

export function checkOneDirect(
  grid: number[][],
  i: number,
  id: number,
  x: number,
  y: number,
) {
  const r = grid.length;
  const c = grid[0].length;
  let nx = x + dir[0][i];
  let ny = y + dir[1][i];
  let flg = false;

  while (isIn(r, c, nx, ny) && grid[nx][ny] === 1 - id) {
    nx += dir[0][i];
    ny += dir[1][i];
    flg = true;
  }
  if (isIn(r, c, nx, ny) && grid[nx][ny] === id && flg) {
    return true;
  }
}

export function checkBetween(
  grid: number[][],
  id: number,
  x: number,
  y: number,
) {
  for (let i = 0; i < 8; ++i) {
    if (checkOneDirect(grid, i, id, x, y)) {
      return true;
    }
  }
  return false;
}

export function reverseOneDirect(
  grid: number[][],
  i: number,
  id: number,
  x: number,
  y: number,
) {
  const r = grid.length;
  const c = grid[0].length;
  if (checkOneDirect(grid, i, id, x, y)) {
    let nx = x + dir[0][i];
    let ny = y + dir[1][i];

    while (isIn(r, c, nx, ny) && grid[nx][ny] === 1 - id) {
      grid[nx][ny] = id;
      nx += dir[0][i];
      ny += dir[1][i];
    }
  }
}

export function reverse(grid: number[][], id: number, x: number, y: number) {
  for (let i = 0; i < 8; ++i) {
    reverseOneDirect(grid, i, id, x, y);
  }
}

export function checkPass(grid: number[][], id: number) {
  const r = grid.length;
  const c = grid[0].length;
  for (let i = 0; i < r; ++i) {
    for (let j = 0; j < c; ++j) {
      if (grid[i][j] === 2 && checkBetween(grid, id, i, j)) {
        return false;
      }
    }
  }
  return true;
}

export function checkGameOver(grid: number[][]) {
  const r = grid.length;
  const c = grid[0].length;

  let ext = 0;
  let emptyCount = 0;
  const cnt = [0, 0];

  for (let i = 0; i < r; ++i) {
    for (let j = 0; j < c; ++j) {
      ext |= 1 << grid[i][j];
      emptyCount += +(grid[i][j] === 2);
      if (grid[i][j] !== 2) {
        cnt[grid[i][j]] += 1;
      }
    }
  }

  if (emptyCount === 0) {
    return cnt[0] === cnt[1]
      ? '两边棋数相同平局'
      : cnt[0] > cnt[1]
      ? '零棋获胜'
      : '壹棋获胜';
  }

  if ((ext & 3) !== 3) {
    return ext === 1 ? '只存在零棋，零棋获胜' : '只存在壹棋，壹棋获胜';
  }

  return '';
}