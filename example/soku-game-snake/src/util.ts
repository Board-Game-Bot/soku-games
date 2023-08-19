/**
 * 深拷贝
 * @param object
 * @param newMap
 */
export function deepClone<T extends Record<string, any> | any[]>(
  object: T,
  newMap = new WeakMap(),
): T {
  if (typeof object !== 'object') {
    return object;
  }
  // 循环引用检测
  if (newMap.has(object)) {
    return newMap.get(object);
  }
  let newObject: any;
  if (Array.isArray(object)) {
    newObject = [];
    newMap.set(object, newObject);
    return newObject.concat(object.map((obj) => deepClone(obj, newMap)));
  } else {
    newObject = {};
    newMap.set(object, newObject);

    Object.keys(object).forEach((key) => {
      newObject[key] = deepClone(object[key], newMap);
    });

    return newObject;
  }
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
