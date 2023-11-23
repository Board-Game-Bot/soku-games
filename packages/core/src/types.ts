export enum LifeCycle {
  BEFORE_PREPARE = 'LifeCycle_BEFORE_PREPARE',
  AFTER_PREPARE = 'LifeCycle_AFTER_PREPARE',
  BEFORE_START = 'LifeCycle_BEFORE_START',
  AFTER_START = 'LifeCycle_AFTER_START',
  BEFORE_STEP = 'LifeCycle_BEFORE_STEP',
  AFTER_STEP = 'LifeCycle_AFTER_STEP',
  BEFORE_END = 'LifeCycle_BEFORE_END',
  AFTER_END = 'LifeCycle_AFTER_END',
  INVALID_FORMAT = 'LifeCycle_INVALID_FORMAT',
  INVALID_STEP = 'LifeCycle_INVALID_STEP',
}

export enum CustomEvent {
  CHANGE_SNAPSHOT = 'CustomEvent_CHANGE_SNAPSHOT' // FOR RENDERER & CONTROLLER
}

export type Event = LifeCycle | CustomEvent;