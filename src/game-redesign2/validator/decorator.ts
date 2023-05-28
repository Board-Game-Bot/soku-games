import { Validator } from './base';

const CONTAINER = new Map<string, Validator>();

export function ValidatorImplement(gameName: string): ClassDecorator {
  return (target: any) => {
    CONTAINER.set(gameName, target);
  };
}

export function createValidator(gameName: string): Validator {
  try {
    const MAKER = CONTAINER.get(gameName);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Validator of game ${gameName} has not been implemented.`
    );
  }
}
