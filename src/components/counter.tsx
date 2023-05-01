import { createSignal } from 'solid-js';

export function Counter(props: { class: any }) {
  const [count, setCount] = createSignal(0);

  return (
    <button {...props} onClick={() => setCount(count() + 1)}>
      count: {count()}
    </button>
  );
}
