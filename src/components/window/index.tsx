import { ParentProps } from 'solid-js';

export function Window(props: ParentProps & { width: number; height: number }) {
  const { width, height } = props;
  let div: HTMLDivElement;

  let shouldMove = false;
  let offset = [0, 0];

  function startMove(e: any) {
    shouldMove = true;
    offset = [e.offsetX, e.offsetY];
  }

  window.addEventListener('mousemove', (e) => {
    if (!shouldMove) return;

    const [x, y] = [e.clientX - offset[0], e.clientY - offset[1]];

    div.style.setProperty('transform', `translate(${x}px, ${y}px)`);
  });

  window.addEventListener('mouseup', (e) => {
    shouldMove = false;
  });

  return (
    <div
      ref={(el) => (div = el)}
      class={`w-[${width}px] h-[${height}px] fixed top-0 left-0 bg-slate-300 rounded-lg overflow-hidden`}
    >
      <h4
        onMouseDown={startMove}
        class={'select-none m-0 bg-slate-500 px-2 py-1'}
      >
        WINDOW
      </h4>
      <div class={'overflow-auto px-4 pb-5'}>{props.children}</div>
    </div>
  );
}
