import { Controller } from './controller/base';
import { Renderer } from './renderer/base';
import { Eventer } from './utils/eventer';
import { Validator } from './validator/base';

export type IEvent = 'start' | 'step' | 'rev-step' | 'stop';
export type IStepDo = {
  step: string;
  todo: Function;
};

export abstract class Game {
  deps = new Map<string, any>();
  before = new Eventer<IEvent>();
  after = new Eventer<IEvent>();

  setRenderer(renderer: Renderer) {
    renderer.setGame(this);
    return this;
  }

  setValidator(validator: Validator) {
    validator.setGame(this);
    return this;
  }

  setController(controller: Controller) {
    controller.setGame(this);
    return this;
  }

  init(data: any) {
    this.initImpl(data);

    return this;
  }

  abstract initImpl(data: any): void;

  start() {
    this.before.emit('start');

    this.after.emit('start');

    return this;
  }

  stop(reason?: string) {
    this.before.emit('stop', reason);
    this.after.emit('stop', reason);

    return this;
  }

  step(s: string) {
    const isOk = { v: true };

    this.before.emit('step', s, isOk);
    if (!isOk.v) {
      return this;
    }
    this.stepImpl(s);
    this.after.emit('step', s);

    return this;
  }

  abstract stepImpl(s: string): void;

  stepStack: IStepDo[] = [];

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
