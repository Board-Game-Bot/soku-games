# soku-game-recorder
 
📼 The example of using `@soku-games/core` to implement `Recorder`.

## Usage(Quick Start)

**You should install dependency `@soku-games/core`, and at least one game.**

And then (e.g. Reversi)

```tsx
import 'soku-game-reversi';
import 'soku-game-recorder';

import {
  NewController,
  NewGame,
  NewGenerator,
  NewRenderer,
  NewValidator,
} from '@soku-games/core';

interface RecordPlayer {
  prepare: (record: Record<string, any>) => void;
  step: () => boolean;
  revStep: () => boolean;
  stepTo: () => boolean;
}

function ReversiDemo(): JSX.Element {
  const [view, setView] = createSignal('');
  const abstractView = () => view();
  const objectiveView = () =>
    view()
      .split('\n')
      .map((line, i) => (
        <div>
          <For each={line.split(' ')}>
            {(c, j) => (
              <button
                style={{
                  width: '60px',
                  height: '60px',
                  'box-sizing': 'border-box',
                  'background-color':
                    c === '2' ? '#040' : c === '0' ? '#333' : '#ccc',
                }}
                onClick={() => {
                  const step = `${turn}${i.toString(36)}${j().toString(36)}`;
                  turn ^= 1;
                  control(step);
                }}
              />
            )}
          </For>
        </div>
      ));

  let turn = 0;

  const gameName = 'reversi';
  let game = NewGame(gameName);
  let renderer = NewRenderer(gameName);
  const controller = NewController(gameName);
  const validator = NewValidator(gameName);
  const generator = NewGenerator(gameName);

  // pay attention
  let recorder = NewRenderer('recorder');
  let control: (strStep: string) => void;
  let record: Record<string, any>;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });
    // pay attention
    recorder.bindGame(game);
    control = controller.bindRenderer(renderer) as unknown as (
      strStep: string,
    ) => void;
    validator.bindGame(game);
    // pay attention
    game.customBind('record-result', (_record: Record<string, any>) => {
      record = _record;
    });
    game.prepare(generator.generate(8, 8)).start();
  });

  let recordPlayer: RecordPlayer;

  function handleLoad() {
    game = NewGame(gameName);
    renderer = NewRenderer(gameName);
    recorder = NewRenderer('recorder');
    const recordController = NewController('recorder');
    renderer.bindGame(game, { print: setView });
    recorder.bindGame(game);
    recordPlayer = recordController.bindRenderer(
      recorder,
    ) as unknown as RecordPlayer;
    recordPlayer.prepare(record);
  }

  let timer: NodeJS.Timer;
  function handlePlay() {
    timer = setInterval(() => {
      if (!recordPlayer.step()) {
        clearInterval(timer);
      }
    }, 1000);
  }

  function handlePause() {
    clearInterval(timer);
  }

  function handleLeft() {
    recordPlayer.revStep();
  }

  function handleRight() {
    recordPlayer.step();
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', 'font-size': '25px' }}>
        <div>{objectiveView()}</div>
        <pre>{abstractView()}</pre>
      </div>
      <div style={{ 'margin-top': '30px' }}>
        <button onClick={handleLoad}>load</button>
        <button onClick={handlePlay}>play</button>
        <button onClick={handlePause}>pause</button>
        <button onClick={handleLeft}>{'<'}</button>
        <button onClick={handleRight}>{'>'}</button>
      </div>
    </>
  );
}

```

And try to use it.

![20230820015429_rec_](https://github.com/Board-Game-Bot/soku-games/assets/84608230/070f5bda-785d-432d-98c6-3935476103be)
