import { Game } from './base';

const CONTAINER = new Map<string, Game>();

export function GameImplement(gameName: string): ClassDecorator {
  return (target: any) => {
    CONTAINER.set(gameName, target);
  };
}

export function createGame(gameName: string): Game {
  try {
    const MAKER = CONTAINER.get(gameName);
    return new (MAKER as any)();
  } catch {
    throw new Error(`The Game ${gameName} has not been implemented.`);
  }
}
