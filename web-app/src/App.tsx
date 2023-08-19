import { createSignal, For, JSX, onMount } from 'solid-js';
import './App.css';

import 'soku-game-snake';
import 'soku-game-reversi';
import 'soku-game-recorder';

// 获取游戏的方式
import {
  NewController,
  NewGame,
  NewGenerator,
  NewRenderer,
  NewValidator,
} from '@soku-games/core';

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
  const game = NewGame(gameName);
  const renderer = NewRenderer(gameName);
  const controller = NewController(gameName);
  const validator = NewValidator(gameName);
  const generator = NewGenerator(gameName);

  const recorder = NewRenderer('snake');

  let control: (strStep: string) => void;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });
    recorder.bindGame(game, {});
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

  let recorder = NewRenderer('recorder');
  let control: (strStep: string) => void;
  let record: Record<string, any>;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });
    recorder.bindGame(game);
    control = controller.bindRenderer(renderer) as unknown as (
      strStep: string,
    ) => void;
    validator.bindGame(game);
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
