import { Generator } from './base';

export const CONTAINER = new Map<string, Generator>();

export function GeneratorImplement(gameName: string) {
  return (target: any) => {
    CONTAINER.set(gameName, target);
  };
}

export function generate(gameName: string, extra: any) {
  const Generator = CONTAINER.get(gameName);

  return (Generator as any).do(extra);
}
