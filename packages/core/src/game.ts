import { flatten } from 'lodash-es';
import { Pubsub } from './util';
import { Event, LifeCycle } from './types';

/**
 * The core of game
 */
export abstract class Game {
  private pubsub: Pubsub = new Pubsub();
  private stepCheckChain: ((stepStr: string) => string)[] = [];

  public data: Record<string, any> = {};
  public bundler: Record<string, any> = {};
  public _deps: Map<string, any> = new Map();

  abstract __prepare(initDataMask: string): void;
  abstract __start(): void;
  abstract __step(stepStr: string): any;
  abstract __isStepValidFormat(stepStr: string): string;
  abstract __end(reason: string): void;

  public subscribe(events: Event | Event[], fn: (...args: any[]) => any) {
    flatten([events]).forEach((event: Event) => {
      this.pubsub.subscribe(event, fn);
    });
  }

  public publish(events: Event | Event[], ...args: any[]) {
    flatten([events]).forEach((event: Event) => {
      this.pubsub.publish(event, ...args);
    });
  }

  public prepare(initDataMask: string) {
    this.pubsub.publish(LifeCycle.BEFORE_PREPARE, initDataMask);
    this.__prepare(initDataMask);
    this.pubsub.publish(LifeCycle.AFTER_PREPARE, this.data);
  }

  public start() {
    this.pubsub.publish(LifeCycle.BEFORE_START);
    this.__start();
    this.pubsub.publish(LifeCycle.AFTER_START);
  }

  public step(stepStr: string) {
    let checkResult = this.__isStepValidFormat(stepStr);
    if (checkResult.length) {
      this.pubsub.publish(LifeCycle.INVALID_FORMAT, checkResult);
      return;
    }
    checkResult = this.stepCheckChain.reduce((pre, cur) => {
      if (pre.length > 0) {
        return pre;
      }
      return cur(stepStr);
    }, '');
    if (checkResult.length) {
      this.pubsub.publish(LifeCycle.INVALID_STEP, checkResult);
      return;
    }
    this.forceStep(stepStr);
  }

  public checkStep(...checkers: ((stepStr: string) => string)[]) {
    this.stepCheckChain.push(...checkers);
  }

  public forceStep(stepStr: string) {
    this.pubsub.publish(LifeCycle.BEFORE_STEP, stepStr);
    const stepDetail = this.__step(stepStr);
    this.pubsub.publish(LifeCycle.AFTER_STEP, stepDetail);
  }

  public end(reason: string) {
    this.pubsub.publish(LifeCycle.BEFORE_END, reason);
    this.__end(reason);
    this.pubsub.publish(LifeCycle.AFTER_END, reason);
  }
}
