import { buildGame, Game, NewGenerator } from '@soku-games/core';

import 'soku-game-snake';
import 'soku-game-reversi';
import 'soku-game-backgammon/core';
import 'soku-game-backgammon/screen';

import { createEffect, createSignal, For } from 'solid-js';

export function App() {
  const [gameName, setGameName] = createSignal('snake');

  const games = ['snake', 'reversi', 'backgammon'];

  return (
    <div class={'w-screen h-screen flex justify-center items-center'}>
      <div>
        <For each={games}>
          {(gameName) => 
            <button onClick={() => setGameName(gameName)}>
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

  createEffect(() => {
    handlePrepare();
  });

  return (
    <>
      <button>prepare</button>
      <button onClick={handleStart}>start {props.gameName}</button>
      <div class={'ma w-1200px aspect-ratio-video bg-black flex justify-center items-center'} ref={el => ref = el} />
    </>
  );
};