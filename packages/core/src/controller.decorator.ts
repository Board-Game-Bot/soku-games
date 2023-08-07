import Controller from './controller';

const CONTAINER = new Map<string, Controller>();

export default function ControllerImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

export function NewController(tag: string): Controller {
  try {
    const MAKER = CONTAINER.get(tag);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Controller of game \`${tag}\` has not been implemented.`,
    );
  }
}
