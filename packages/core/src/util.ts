type Fn = (...args: any[]) => void;

export class Pubsub {
  callbackMap: Map<
    string | number,
    {
      event: string | number;
      callback: Fn;
      count: number;
    }[]
  > = new Map();

  subscribe(event: string | number, callback: Fn, count?: number) {
    const callbacks = this.callbackMap.get(event) ?? [];
    callbacks.push({
      event,
      callback,
      count: count ?? -1,
    });
    this.callbackMap.set(event, callbacks);
  }

  publish(event: string | number, ...args: any[]) {
    const callbacks = this.callbackMap.get(event) ?? [];

    this.callbackMap.set(
      event,
      callbacks?.filter((callback) => {
        callback.callback(...args);
        return --callback.count;
      }),
    );
  }

  unsubscribe(event: string | number, callback?: Fn) {
    if (callback) {
      const callbacks = this.callbackMap
        .get(event)
        ?.filter((callbackDetail) => {
          return callbackDetail.callback !== callback;
        });
      this.callbackMap.set(event, callbacks ?? []);
    }
    else {
      this.callbackMap.delete(event);
    }
  }
}

type DeepArray<T> = (T | DeepArray<T>)[];

export const flatten = <T>(array: DeepArray<T>) => {
  const result: T[] = [];
  array.forEach((item) => {
    if (Array.isArray(item))
      result.push(...flatten(item));
    else result.push(item);
  });
  return result;
};