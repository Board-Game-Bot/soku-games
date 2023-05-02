export class Eventer {
  private map: Map<string, Function[]> = new Map();

  on(tag: string, fn: Function) {
    const fns = this.map.get(tag) || [];
    this.map.set(tag, [...fns, fn]);
    return this;
  }

  off(tag: string, fn?: Function) {
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

  emit(tag: string, ...args: any) {
    const fns = this.map.get(tag) || [];
    fns.forEach((fn) => fn(...args));
    return this;
  }
}
