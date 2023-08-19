import Generator from './generator';

const CONTAINER = new Map<string, any>();

export default function GeneratorImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

export function NewGenerator(tag: string): Generator {
  try {
    const MAKER = CONTAINER.get(tag);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Generator of game \`${tag}\` has not been implemented.`,
    );
  }
}
