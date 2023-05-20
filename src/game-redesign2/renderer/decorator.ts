import { Game } from '../game.base';
import { Renderer } from './base';

const CONTAINER = new Map<string, Renderer>();

export function RendererImplement(gameName: string): ClassDecorator {
  return (target: any) => {
    CONTAINER.set(gameName, target);
  };
}

export function createRenderer(gameName: string): Renderer {
  try {
    const MAKER = CONTAINER.get(gameName);
    return new (MAKER as any)();
  } catch {
    throw new Error(
      `The Renderer of game ${gameName} has not been implemented.`
    );
  }
}
