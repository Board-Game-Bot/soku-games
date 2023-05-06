import { Eventer } from './utils/eventer';
import { Game } from './game.base';

export class GameObject {
  game: Game;
  constructor(game: Game) {
    this.game = game;

    game.objs.push(this);
  }
  get c() {
    return this.game.g?.context;
  }
  get L() {
    return this.game.screen?._L;
  }

  _dt = 0;
  get dt() {
    return this._dt;
  }
  set dt(v) {
    this._dt = v / 1000;
  }

  before: Eventer = new Eventer();
  after: Eventer = new Eventer();
  started = false;
  start() {
    this.before.emit('start');
    this.started = true;
    this.after.emit('start');
  }

  destroyed = false;
  destroy() {
    this.before.emit('destroy');
    this.destroyed = true;
    const objs = this.game.objs;
    objs.splice(objs.indexOf(this), 1);
    this.after.emit('destroy');
  }

  updaters = new Map<string, Function[]>();
  update() {
    [...this.updaters.values()].forEach((fns) =>
      fns.forEach((fn) => fn(this.dt))
    );
  }
  mkUpdater(tag: string, fn: Function) {
    const fns = this.updaters.get(tag) || [];
    this.updaters.set(tag, [...fns, fn]);
  }
  rmUpdater(tag: string, fn?: Function) {
    let fns = this.updaters.get(tag) || [];
    if (!fn) {
      fns = [];
    } else {
      fns = fns.filter((f) => f !== fn);
    }
    this.updaters.set(tag, fns);
  }
}
