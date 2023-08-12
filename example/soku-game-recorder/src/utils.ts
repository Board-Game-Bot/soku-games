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
