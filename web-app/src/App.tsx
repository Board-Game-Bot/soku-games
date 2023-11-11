import { buildGame, Game, NewGenerator } from '@soku-games/core';

import 'soku-game-snake';
import 'soku-game-reversi';

export function App() {
  return <TheGame gameName={'reversi'} />;
}

interface Props {
  gameName: string;
}

const TheGame = ({ gameName }: Props) => {
  let game: Game;
  let ref: HTMLDivElement;

  function handleClick() {
    let turn = 0;
    game = buildGame({
      name: gameName,
      plugins: [
        {
          name: `${gameName}-screen`,
          extra: {
            el: ref,
            couldControl: [true, true],
            emit: (stepStr: string) => {
              game?.step(turn + stepStr);
              turn ^= 1;
              // 这里以后会统一成通过 socket 去发送/接受信息
              // const [i, d] = stepStr.split('').map(Number);
              // ds[i] = d;
              // if (ds.every(d => ~d)) {
              //   game.step(ds.join('') + '1');
              //   ds[0] = ds[1] = -1;
              // }
            },
          },
        },
      ],
    })!;
    const data = NewGenerator('reversi').generate(8, 8, 20);
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