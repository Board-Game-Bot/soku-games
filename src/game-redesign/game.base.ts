import { Eventer } from './utils/eventer';
import { G } from './utils/g';
import { GameObject } from './game.object';
import { Screen } from './screen';

export type IMode = 'single' | 'multi' | 'record' | 'watch';
export type IEvent = 'start' | 'step' | 'rev-step' | 'stop';
export type IStepDo = {
  step: string;
  todo: Function;
};

export abstract class Game {
  objs: GameObject[] = [];
  before: Eventer<IEvent> = new Eventer();
  after: Eventer<IEvent> = new Eventer();

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
    this.addRendererImpl();
    return this;
  }

  abstract addRendererImpl(): void;

  setJudgement() {
    this.setJudgementImpl();
    return this;
  }
  abstract setJudgementImpl(): void;

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
    if (window && window.requestAnimationFrame) {
      const frame = (_tp: number) => {
        if (!tp) {
          tp = _tp;
        } else {
          this.frame(_tp, tp);
        }
        tp = _tp;
        window.requestAnimationFrame(frame);
      };
      this.engine = window.requestAnimationFrame(frame);
    }

    this.after.emit('start');

    return this;
  }

  frame(_tp = 0, tp = 0) {
    this.objs.forEach((obj) => {
      if (!obj.started) {
        obj.start();
      } else {
        obj.dt = _tp - tp;
        obj.update();
      }
    });
  }

  // 游戏结束
  reason: string = '';
  stop(reason: string) {
    this.before.emit('stop', reason);

    if (window && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(this.engine);
    }

    this.objs = [];

    this.after.emit('stop', reason);

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
