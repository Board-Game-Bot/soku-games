import Validator from './validator';

const CONTAINER = new Map<string, any>();

export default function RendererImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

export function NewValidator(tag: string): Validator {
  try {
    const MAKER = CONTAINER.get(tag);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Validator of game \`${tag}\` has not been implemented.`,
    );
  }
}
