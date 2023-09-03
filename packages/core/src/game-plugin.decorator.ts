import { GamePlugin } from './game-plugin';

const CONTAINER = new Map<string, typeof GamePlugin.constructor>();

export function GamePluginImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

export function NewPlugin(tag: string): GamePlugin {
  const MAKER = CONTAINER.get(tag);
  if (!MAKER) {
    throw new Error(`The GamePlugin \`${tag}\` has not been implemented.`);
  }
  return new (MAKER as any)();
}
