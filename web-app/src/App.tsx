import { createSignal, JSX, onMount } from 'solid-js';
// FIXME: 静态检查
import solidLogo from './assets/solid.svg';
import viteLogo from '/vite.svg';
import './App.css';

import 'soku-game-snake';
import 'soku-game-reversi';

// 获取游戏的方式
import {
  NewController,
  NewGame,
  NewGenerator,
  NewRenderer,
} from '@soku-games/core';

function App(): JSX.Element {
  const [count, setCount] = createSignal(0);
  const [text, setText] = createSignal('');
  const [view, setView] = createSignal('');
  const objectiveView = () =>
    view()
      .replace(/1/g, '🧱')
      .replace(/0/g, '🌿')
      .replace(/A/g, '🐱')
      .replace(/B/g, '🐶');
  const abstractiveView = () => view();

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const str = (e.target as HTMLInputElement).value;
      control(str);
      setText('');
    }
  }

  // 获取游戏实例
  const game = NewGame('snake');
  const generator = NewGenerator('snake');
  const renderer = NewRenderer('snake');
  const controller = NewController('snake');
  let control: (strStep: string) => void;

  onMount(() => {
    renderer.bindGame(game, {
      print: setView,
    });

    controller.bindRenderer(renderer, {
      bindController: (con: (strStep: string) => void) => {
        control = con;
      },
    });

    const initData = generator.generate(13, 14, 10);
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
        value={text()}
        type="text"
        onKeyDown={handleKeyDown}
        onChange={(e) => setText((e.target as HTMLInputElement).value)}
      />
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  );
}

export default App;
