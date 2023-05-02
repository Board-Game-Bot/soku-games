import { Game } from './game.base';

export const GameContainer = new Map<string | number, Game>();

export const GameImplement = (name: string, id?: number) =>
  ((target: Game) => {
    GameContainer.set(name, target);
    if (id) GameContainer.set(id, target);
  }) as ClassDecorator;

export function createGame(tag: string): Game {
  const Constructor = GameContainer.get(tag);

  return new (Constructor as any)();
}
