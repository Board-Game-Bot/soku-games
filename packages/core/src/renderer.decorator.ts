import Renderer from './renderer';

const CONTAINER = new Map<string, Renderer>();

export default function RendererImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

export function NewRenderer(tag: string): Generator {
  try {
    const MAKER = CONTAINER.get(tag);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Renderer of game \`${tag}\` has not been implemented.`,
    );
  }
}
