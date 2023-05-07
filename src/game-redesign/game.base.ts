import { Eventer } from './utils/eventer';
import { G } from './utils/g';
import { GameObject } from './game.object';
import { Screen } from './screen';

export type IMode = 'single' | 'multi' | 'record' | 'watch';
export type IStepDo = {
  step: string;
  todo: Function;
};

export abstract class Game {
  objs: GameObject[] = [];
  before: Eventer = new Eventer();
  after: Eventer = new Eventer();

  screen?: Screen;
  get L() {
    return this.screen?.L;
  }

  canvas?: HTMLCanvasElement;
  g?: G;
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.g = new G(canvas);
    this.screen = new Screen(this);
    return this;
  }

  mode?: IMode;
  setMode(mode: IMode) {
    this.mode = mode;
    return this;
  }

  // 开始游戏前需要 init
  init(data: any) {
    this.after.on('start', () => {
      this.initImpl(data);
    });

    return this;
  }

  abstract initImpl(data: any): void;

  // 开始游戏，启动游戏引擎
  engine: number = 0;
  start() {
    this.before.emit('start');

    let tp = 0;
    const frame = (_tp: number) => {
      if (!tp) {
        tp = _tp;
      } else {
        this.objs.forEach((obj) => {
          if (!obj.started) {
            obj.start();
          } else {
            obj.dt = _tp - tp;
            obj.update();
          }
        });
      }
      tp = _tp;
      window.requestAnimationFrame(frame);
    };
    this.engine = window.requestAnimationFrame(frame);

    this.after.emit('start');

    return this;
  }

  // 游戏结束
  stop() {
    this.before.emit('stop');

    window.cancelAnimationFrame(this.engine);
    this.objs = [];

    this.after.emit('stop');

    return this;
  }

  shouldValidate = false;
  openValidate(ops: boolean) {
    this.shouldValidate = ops;
    return this;
  }

  step(s: string) {
    if (this.shouldValidate && !this.validateImpl(s)) return;

    this.before.emit('step', s);
    this.stepImpl(s);
    this.after.emit('step', s);

    return this;
  }

  abstract validateImpl(s: string): boolean;

  abstract stepImpl(s: string): void;

  stepStack: { step: string; todo: Function }[] = [];

  pushStep(step: string, todo: Function) {
    this.stepStack.push({ step, todo });
    return this;
  }

  revStep() {
    if (!this.stepStack.length) return;

    const { step, todo } = this.stepStack.pop()!;

    this.before.emit('rev-step', step);
    todo();
    this.after.emit('rev-step', step);
    return this;
  }
}
