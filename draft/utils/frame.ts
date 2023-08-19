export const frame = (fn: Function, isStop: { v: boolean }) => {
  let lastT = 0;
  const engine = (currentT: number) => {
    if (lastT) {
      const dt = currentT - lastT;
      fn(dt);
    }
    lastT = currentT;
    if (isStop.v) {
      return;
    }
    window.requestAnimationFrame(engine);
  };

  window.requestAnimationFrame(engine);
};
