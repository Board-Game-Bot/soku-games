type Fn = (...args: any[]) => void;

export class EventEmitter {
  fns: {
    tag: string;
    cb: Fn;
  }[] = [];

  on(tag: string, cb: Fn) {
    this.fns.push({ tag, cb });
  }

  off(tag: string) {
    this.fns = this.fns.filter((fn) => fn.tag !== tag);
  }

  emit(tag: string, ...args: any[]) {
    this.fns.filter((fn) => fn.tag === tag).forEach((fn) => fn.cb(...args));
  }

  clear() {
    this.fns = [];
  }
}
