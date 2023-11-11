import { buildGame, Game, NewGenerator } from '@soku-games/core';

import 'soku-game-snake';

export function App() {
  return <SnakeGame />;
}

const SnakeGame = () => {
  let game: Game;
  let ref: HTMLDivElement;

  function handleClick() {
    const ds = [-1, -1];
    game = buildGame({
      name: 'snake',
      plugins: [
        {
          name: 'snake-screen',
          extra: {
            el: ref,
            couldControl: [true, true],
            emit: (stepStr: string) => {
              // 这里以后会统一成通过 socket 去发送/接受信息
              const [i, d] = stepStr.split('').map(Number);
              ds[i] = d;
              if (ds.every(d => ~d)) {
                game.step(ds.join('') + '1');
                ds[0] = ds[1] = -1;
              }
            },
          },
        },
      ],
    })!;
    const data = NewGenerator('snake').generate(13, 14, 20);
    game.prepare(data);
  }

  function handleStart() {
    game?.start();
  }

  return (
    <>
      <div ref={el => ref = el} />
      <button onClick={handleClick}>Click</button>
      <button onClick={handleStart}>Start</button>
    </>
  );
};