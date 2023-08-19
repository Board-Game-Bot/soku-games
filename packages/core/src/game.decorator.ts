import Game from './game';

const CONTAINER = new Map<string, any>();

export default function GameImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

export function NewGame(tag: string): Game {
  try {
    const MAKER = CONTAINER.get(tag);
    return new (MAKER as any)();
  } catch {
    throw new Error(`The Game \`${tag}\` has not been implemented.`);
  }
}
