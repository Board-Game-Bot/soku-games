export function deepClone<T extends Record<string, any> | any[]>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

export function initialGrid(strData: string) {
  const [_r, _c, mask] = strData.split(' ');
  const r = +_r;
  const c = +_c;
  const grid = Array(r)
    .fill(0)
    .map((_, i) =>
      Array(c)
        .fill(0)
        .map((_, j) => +mask[i * c + j]),
    );
  for (let i = 0; i < r; ++i) {
    for (let j = 0; j < c; ++j) {
      grid[i][j] = +mask[i * c + j];
    }
  }
  return { r, c, grid };
}
