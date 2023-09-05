import { createSignal, For, JSX, onMount } from 'solid-js';
import './App.css';

import 'soku-game-snake';
import 'soku-game-reversi';
import 'soku-game-recorder';

// 获取游戏的方式
import { buildGame, NewGenerator } from '@soku-games/core';
import type { TRecord, TRecordPlayer } from 'soku-game-recorder';

const [theRecord, setTheRecord] = createSignal<TRecord>();

function App(): JSX.Element {
  return (
    <>
      <SnakeDemo />
      <ReversiDemo />
      <div />
    </>
  );
}

export default App;

interface RecordPlayer {
  prepare: (record: Record<string, any>) => void;
  step: () => boolean;
  revStep: () => boolean;
  stepTo: () => boolean;
}

function SnakeDemo(): JSX.Element {
  const [view, setView] = createSignal('');
  const gameName = 'snake';
  const generator = NewGenerator(gameName);

  let control: (strStep: string) => void;

  onMount(() => {
    const game = buildGame({
      name: 'snake',
      plugins: [
        {
          name: 'snake-renderer',
          extra: {
            print: setView,
          },
        },
        'snake-controller',
        'snake-validator',
        'record-renderer',
      ],
    })!;
    const { controller, resultPromise } = game.bundler;
    game.prepare(generator.generate(13, 14, 20));
    control = controller.control;
    game.start();
    (resultPromise as Promise<any>).then(setTheRecord);
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
      <RecordPlayer name="snake" print={setView} record={theRecord()} />
    </>
  );
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
                  padding: '5px',
                  'background-color': '#040',
                }}
                onClick={() => {
                  const step = `${turn}${i.toString(36)}${j().toString(36)}`;
                  turn ^= 1;
                  control(step);
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    'border-radius': '5px',
                    'background-color':
                      c === '2' ? '#040' : c === '0' ? '#333' : '#ccc',
                    'border-color':
                      c === '2' ? '#040' : c === '0' ? '#ccc' : '#333',
                    border: '3px',
                  }}
                />
              </button>
            )}
          </For>
        </div>
      ));

  let turn = 0;
  let control: (strStep: string) => void;

  onMount(() => {
    const game = buildGame({
      name: 'reversi',
      plugins: [
        {
          name: 'reversi-renderer',
          extra: { print: setView },
        },
        'reversi-controller',
        'reversi-validator',
        'record-renderer',
      ],
    })!;
    const { controller, resultPromise } = game.bundler;
    control = controller.control;
    const generator = NewGenerator('reversi');
    game.prepare(generator.generate(8, 8));
    resultPromise.then(setTheRecord);
    game.start();
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', 'font-size': '25px' }}>
        <div>{objectiveView()}</div>
        <pre>{abstractView()}</pre>
      </div>
      <RecordPlayer name="reversi" record={theRecord()} print={setView} />
    </>
  );
}

function RecordPlayer(props: {
  record?: TRecord;
  name: string;
  print: (view: string) => void;
}) {
  let recordPlayer: TRecordPlayer;

  function handleLoad() {
    const game = buildGame({
      name: props.name,
      plugins: [
        {
          name: `${props.name}-renderer`,
          extra: {
            print: props.print,
          },
        },
        'record-controller',
      ],
    })!;
    recordPlayer = game.bundler.recordPlayer;
    recordPlayer.prepare(props.record!);
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
    <div style={{ 'margin-top': '30px' }}>
      <button onClick={handleLoad}>load</button>
      <button onClick={handlePlay}>play</button>
      <button onClick={handlePause}>pause</button>
      <button onClick={handleLeft}>{'<'}</button>
      <button onClick={handleRight}>{'>'}</button>
    </div>
  );
}
