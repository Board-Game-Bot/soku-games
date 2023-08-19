# soku-game-reversi

⚫️⚪️ The example of using `@soku-games/core` to implement game `Reversi`.

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
import 'soku-game-reversi';

function ReversiDemo(): JSX.Element {
  const [view, setView] = createSignal('');
  const abstractView = () => view();
  const objectiveView = () =>
    view()
      .split('\n')
      .map((line, i) => (
        <div>
          {line.split(' ').map((c, j) => (
            <button
              style={{
                width: '60px',
                height: '60px',
                'box-sizing': 'border-box',
                'background-color':
                  c === '2' ? '#040' : c === '0' ? '#333' : '#ccc',
              }}
              onClick={() => {
                const step = `${turn}${i.toString(36)}${j.toString(36)}`;
                turn ^= 1;
                control(step);
              }}
            />
          ))}
        </div>
      ));

  let turn = 0;

  const gameName = 'reversi';
  const game = NewGame(gameName);
  const renderer = NewRenderer(gameName);
  const controller = NewController(gameName);
  const validator = NewValidator(gameName);
  const generator = NewGenerator(gameName);

  let control: (strStep: string) => void;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });
    control = controller.bindRenderer(renderer) as unknown as (
      strStep: string,
    ) => void;
    validator.bindGame(game);
    game.prepare(generator.generate(8, 8)).start();
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', 'font-size': '25px' }}>
        <div>{objectiveView()}</div>
        <pre>{abstractView()}</pre>
      </div>
    </>
  );
}
```

Now look at website, try to play.

![20230819233908_rec_](https://github.com/Board-Game-Bot/soku-games/assets/84608230/fdb8e11c-f45a-4ce1-8a8b-a45e94a007f1)
