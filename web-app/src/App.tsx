import { buildGame, Game, NewGenerator } from '@soku-games/core';
import * as core from '@soku-games/core';

import { createSignal, For, onMount } from 'solid-js';
import { downloadGame, loadingMap, setLoadingMap } from './utils';

Object.assign(window, {
  core,
});

export function App() {
  const [gameName, setGameName] = createSignal('snake');

  const games = ['snake', 'reversi', 'backgammon'];
  const versions = ['1.7.3', '1.6.0', '0.5.1'];

  onMount(() => {
    games.forEach((gameName, i) => {
      const ok = () => {
        const cnt = loadingMap()[gameName] ?? 0;
        setLoadingMap({
          ...loadingMap(),
          [gameName]: cnt + 1,
        });
      };
      downloadGame(`soku-game-${gameName}`, versions[i], 'core', ok);
      downloadGame(`soku-game-${gameName}`, versions[i], 'screen', ok);
    });
  });

  return (
    <div class={'w-screen h-screen flex justify-center items-center'}>
      <div>
        <For each={games}>
          {(gameName) => 
            <button onClick={() => setGameName(gameName)} disabled={loadingMap()[gameName] !== 2}>
              {gameName}
            </button>
          }
        </For>
        <TheGame gameName={gameName()} />
      </div>
    </div>
  );
}

interface Props {
  gameName: string;
}

const TheGame = (props: Props) => {
  let game: Game;
  let ref: HTMLDivElement;

  function handlePrepare() {
    ref.innerHTML = '';
    game = buildGame({
      name: props.gameName,
      plugins: [
        `${props.gameName}-validator`,
        {
          name: `${props.gameName}-screen`,
          extra: {
            el: ref,
            couldControl: [true, true],
            emit: (stepStr: string) => game?.step(stepStr),
          },
        },
      ],
    })!;
    const data = NewGenerator(props.gameName).generate();
    game.prepare(data);
  }

  function handleStart() {
    game?.start();
  }

  return (
    <>
      <button onClick={handlePrepare}>prepare</button>
      <button onClick={handleStart}>start {props.gameName}</button>
      <div class={'ma w-1200px aspect-ratio-video bg-black flex justify-center items-center'} ref={el => ref = el} />
    </>
  );
};