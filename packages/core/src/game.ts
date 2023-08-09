import { EventEmitter } from './util';

/**
 * The core of game
 */
export default abstract class Game {
  private ee = new EventEmitter();
  private checkChain: ((stepStr: string) => string)[] = [];
  private status: 'prepare' | 'started' | 'ended' = 'prepare';

  public prepare(strData: string) {
    this.ee.emit('before:prepare', strData);
    this._prepare(strData);
    this.ee.emit('after:prepare', strData);
  }

  public beforePrepare(fn: (strData: string) => void) {
    this.ee.on('before:prepare', fn);
  }

  abstract _prepare(strData: string): void;

  public afterPrepare(fn: (strData: string) => void) {
    this.ee.on('after:prepare', fn);
  }

  public beforeStart(fn: () => void) {
    this.ee.on('before:start', fn);
  }

  abstract _start(): void;

  public afterStart(fn: () => void) {
    this.ee.on('after:start', fn);
  }

  public start() {
    if (this.status !== 'prepare') {
      return;
    }
    this.ee.emit('before:start');
    this._start();
    this.ee.emit('after:start');
    this.status = 'started';
  }

  abstract isValidFormat(stepStr: string): boolean;

  public onInvalidFormat(fn: (stepStr: string, reason: string) => void) {
    this.ee.on('after:invalid-format', fn);
  }

  public stepCheck(fn: (stepStr: string) => string) {
    this.checkChain.push(fn);
  }

  public shouldStep(stepStr: string): string {
    return this.checkChain.reduce((pre, cur) => {
      if (pre) {
        return pre;
      }
      return pre + cur(stepStr);
    }, '');
  }

  public onInvalidStep(fn: (stepStr: string) => void): void {
    this.ee.on('after:invalid-step', fn);
  }

  public beforeStep(fn: (stepStr: string) => void): void {
    this.ee.on('before:step', fn);
  }

  abstract _step(stepStr: string): void;

  public afterStep(fn: (stepStr: string) => void): void {
    this.ee.on('after:step', fn);
  }

  public sysStep(stepStr: string): void {
    this.ee.emit('before:step', stepStr);
    this._step(stepStr);
    this.ee.emit('after:step', stepStr);
  }

  public step(stepStr: string) {
    if (this.status !== 'started') {
      return;
    }
    if (!this.isValidFormat(stepStr)) {
      this.ee.emit('after:invalid-format', stepStr);
      return;
    }
    let reason: string;
    if ((reason = this.shouldStep(stepStr))) {
      this.ee.emit('after:invalid-step', stepStr, reason);
      return;
    }
    this.ee.emit('before:step', stepStr);
    this._step(stepStr);
    this.ee.emit('after:step', stepStr);
  }

  public beforeEnd(fn: (reason: string) => void) {
    this.ee.on('before:end', fn);
  }

  abstract _end(reason: string): void;

  public afterEnd(fn: (reason: string) => void) {
    this.ee.on('after:end', fn);
  }

  public end(reason: string) {
    if (this.status !== 'started') {
      return;
    }
    this.ee.emit('before:end', reason);
    this._end(reason);
    this.ee.emit('after:end', reason);
    this.status = 'ended';

    this.ee.clear();
  }
}
