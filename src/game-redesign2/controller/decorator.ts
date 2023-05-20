import { Controller } from './base';

const CONTAINER = new Map<string, Controller>();

export function ControllerImplement(gameName: string): ClassDecorator {
  return (target: any) => {
    CONTAINER.set(gameName, target);
  };
}

export function createController(gameName: string): Controller {
  try {
    const MAKER = CONTAINER.get(gameName);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Controller of game ${gameName} has not been implemented.`
    );
  }
}
