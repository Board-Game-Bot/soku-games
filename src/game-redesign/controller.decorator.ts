import { Controller } from './controller.base';

type Type = 'local' | 'network-single' | 'network-multi' | 'record';

const ControllerContainer = new Map<Type, Map<string, Controller>>();

export function GameControllerImplement(type: Type, tag: string, id?: number) {
  return ((target: Controller) => {
    if (!ControllerContainer.has(type)) {
      ControllerContainer.set(type, new Map());
    }
    const tagMap = ControllerContainer.get(type)!;
    tagMap.set(tag, target);
  }) as ClassDecorator;
}

export function getController(type: Type, tag: string): Controller {
  const Constructor = ControllerContainer.get(type)?.get(tag);
  return new (Constructor as any)();
}
