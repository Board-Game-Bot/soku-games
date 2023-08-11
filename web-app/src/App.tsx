import { createSignal, JSX, onMount } from 'solid-js';
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

function App(): JSX.Element {
  const [count, setCount] = createSignal(0);
  const [view, setView] = createSignal('');
  const objectiveView = () =>
    view()
      .replace(/0/g, '🌿️')
      .replace(/1/g, '🧱️')
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
  const gameName = 'snake';
  const game = NewGame(gameName);
  const generator = NewGenerator(gameName);
  const renderer = NewRenderer(gameName);
  const controller = NewController(gameName);
  const validator = NewValidator(gameName);
  const recorder = NewRenderer('recorder');

  let control: (strStep: string) => void;

  onMount(() => {
    validator.bindGame(game);

    renderer.bindGame(game, {
      print: setView,
    });

    recorder.bindGame(game, {
      getResult(record: Record<string, any>) {
        console.log(record);
      },
    });

    controller.bindRenderer(renderer, {
      bindController: (con: (strStep: string) => void) => {
        control = con;
      },
    });

    const initData = generator.generate(8, 8, 10);
    game.prepare(initData);

    game.start();
  });

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
      <div style={{ display: 'flex', gap: '30px' }}>
        <pre>{objectiveView()}</pre>
        <pre>{abstractiveView()}</pre>
      </div>
      <input
        ref={(t) => (inputRef = t)}
        type="text"
        onKeyDown={handleKeyDown}
      />
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  );
}

export default App;
