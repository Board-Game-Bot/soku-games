# soku-game-snake

🐍 The example of using `@soku-games/core` to implement game `Double Snake`.

## Usage(Quick Start)

**You should install dependency `@soku-games/core` at first.**

And then
```tsx
// assume that using Solid-JS in `src/App.tsx`
// all the api to use
import {
  NewController,
  NewGame,
  NewGenerator,
  NewRenderer,
  NewValidator,
} from '@soku-games/core';

// must do
import 'soku-game-snake';

function SnakeDemo(): JSX.Element {
  const [view, setView] = createSignal('');
  const game = NewGame('snake');
  const renderer = NewRenderer('snake');
  const controller = NewController('snake');
  const validator = NewValidator('snake');
  const generator = NewGenerator('snake');

  let control: (strStep: string) => void;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });
    control = controller.bindRenderer(renderer) as unknown as (
      strStep: string,
    ) => void;
    validator.bindGame(game);
    game.prepare(generator.generate(13, 14, 20)).start();
  });

  const abstractView = () => view();
  const objectiveView = () =>
    abstractView()
      .replace(/0/g, '🌿️')
      .replace(/1/g, '🧱️')
      .replace(/A/g, '🐱')
      .replace(/B/g, '🐶');

  let inputRef: HTMLInputElement;

  function handleSubmit(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const str = inputRef.value;
      control(str);
      inputRef.value = '';
    }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', 'font-size': '25px' }}>
        <pre>{objectiveView()}</pre>
        <pre>{abstractView()}</pre>
      </div>
      <input
        style={{ 'font-size': '25px', 'padding-inline': '10px' }}
        ref={(el) => (inputRef = el)}
        type="text"
        onKeyDown={handleSubmit}
      />
    </>
  );
}
```

Now look at website, try to play.
![20230819225706_rec_](https://github.com/Board-Game-Bot/soku-games/assets/84608230/1f46e685-c032-45af-a448-dbf6e39dbab6)

