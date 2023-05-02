import { DataGenerator } from './data.generator';

export const GeneratorContainer = new Map<string | number, DataGenerator>();

export const GeneratorImplement = (name: string, id?: number) =>
  ((target: DataGenerator) => {
    GeneratorContainer.set(name, target);
    if (id) GeneratorContainer.set(id, target);
  }) as ClassDecorator;

export function generate(tag: string, extra: any) {
  const Generator = GeneratorContainer.get(tag);
  return (Generator as any).do(extra);
}
