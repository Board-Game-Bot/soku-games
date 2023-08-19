import { createSignal, For, JSX, onMount } from 'solid-js';
import solidLogo from './assets/solid.svg';
import viteLogo from '/vite.svg';
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

interface RecordPlayer {
  prepare: (record: Record<string, any>) => void;
  step: () => boolean;
  revStep: () => boolean;
  stepTo: () => boolean;
}

function App(): JSX.Element {
  const [count, setCount] = createSignal(0);
  const [view, setView] = createSignal('');
  const objectiveView = () =>
    view()
      // .replace(/0/g, '🌿️')
      // .replace(/1/g, '🧱️')
      .replace(/0/g, '⚫️')
      .replace(/1/g, '⚪️️')
      .replace(/2/g, '🟩')
      .replace(/A/g, '🐱')
      .replace(/B/g, '🐶');
  const abstractiveView = () => view();
  let inputRef: HTMLInputElement;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const str = inputRef.value;
      control(str);
      inputRef.value = '';
    }
  }

  // 获取游戏实例
  const gameName = 'reversi';
  const game = NewGame(gameName);
  const generator = NewGenerator(gameName);
  const renderer = NewRenderer(gameName);
  const controller = NewController(gameName);
  const validator = NewValidator(gameName);
  const recorder = NewRenderer('recorder');

  let control: (strStep: string) => void;
  let record: Record<string, any>;
  let turn = 0;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });

    recorder.bindGame(game, {
      getResult(_record: Record<string, any>) {
        console.log(_record);
        record = _record;
      },
    });

    validator.bindGame(game);

    control = controller.bindRenderer(renderer) as unknown as (
      strStep: string,
    ) => void;

    const initData = generator.generate(8, 8, 10);

    game.customBind('pass', (t: number) => {
      turn = t;
    });
    game.prepare(initData);
    game.start();
  });

  let currentRecordPlayer: RecordPlayer;

  // 绑定游戏录像
  function handleClickBind() {
    const game = NewGame(gameName);
    const renderer = NewRenderer(gameName);
    const recorder = NewRenderer('recorder');
    const recordPlayer = NewController('recorder');

    renderer.bindGame(game, { print: setView });
    recorder.bindGame(game);

    currentRecordPlayer = recordPlayer.bindRenderer(
      recorder,
    ) as unknown as RecordPlayer;
    currentRecordPlayer.prepare(record);
  }
  //
  function handleClickPlay() {
    const timer = setInterval(() => {
      if (!currentRecordPlayer.step()) {
        clearInterval(timer);
      }
    }, 1000);
  }

  function handleLeft() {
    currentRecordPlayer.revStep();
  }

  function handleRight() {
    currentRecordPlayer.step();
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div style={{ display: 'flex', gap: '30px', 'font-size': '20px' }}>
        <pre>{objectiveView()}</pre>
        <pre>{abstractiveView()}</pre>
        <ButtonGroup
          r={8}
          c={8}
          onClick={(i, j) => {
            const step = `${turn}${i.toString(36)}${j.toString(36)}`;
            turn ^= 1;
            control(step);
          }}
        />
      </div>
      <input
        ref={(t) => (inputRef = t)}
        type="text"
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleClickBind}>绑定</button>
      <button onClick={handleClickPlay}>播放</button>
      <button onClick={handleLeft}>左</button>
      <button onClick={handleRight}>右</button>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  );
}

export default App;

function ButtonGroup(props: {
  r: number;
  c: number;
  onClick: (x: number, y: number) => void;
}) {
  return (
    <div>
      <For each={Array(props.r).fill(0)}>
        {(_, i) => (
          <div>
            <For each={Array(props.c).fill(0)}>
              {(_, j) => (
                <button
                  style={{
                    width: '50px',
                    height: '50px',
                    'background-color': (i() + j()) & 1 ? 'black' : 'gray',
                  }}
                  onClick={() => props.onClick(i(), j())}
                />
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}
