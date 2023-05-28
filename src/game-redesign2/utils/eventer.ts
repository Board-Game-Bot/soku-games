export class Eventer<T = string> {
  private map: Map<T, Function[]> = new Map();

  on(tag: T, fn: Function) {
    const fns = this.map.get(tag) || [];
    this.map.set(tag, [...fns, fn]);
    return this;
  }

  off(tag: T, fn?: Function) {
    let fns = this.map.get(tag) || [];
    if (fn) {
      fns = fns.filter((f) => f !== fn);
    } else {
      fns = [];
    }
    if (fns.length) {
      this.map.set(tag, fns);
    }
    return this;
  }

  clear() {
    this.map.clear();
  }

  emit(tag: T, ...args: any) {
    const fns = this.map.get(tag) || [];
    fns.forEach((fn) => fn(...args));
    return this;
  }
}
