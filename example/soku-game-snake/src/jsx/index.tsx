import React from 'react';
import { CustomEvent, LifeCycle } from '@soku-games/core';
import { SnakeGame } from '../core/game.js';
import { SnakeSnapshot } from '../core/types.js';
import { Wall } from './Wall';
import { Snake } from './Snake';
import { GameContext } from './context';

interface Props {
  game: SnakeGame;
  emit: (stepStr: string) => void;
  couldControl?: boolean[];
  ratio: {
    width: number;
    height: number;
  }
}

export const App = React.memo((props: Props) => {
  const { game, couldControl, emit, ratio } = props;
  const [data, setData] = React.useState<SnakeSnapshot>();

  React.useEffect(
    () => {
      game.subscribe(
        [LifeCycle.AFTER_START, LifeCycle.AFTER_STEP, CustomEvent.CHANGE_SNAPSHOT],
        () => setData({ ...game.data }),
      );
    },
    [],
  );

  const ref = React.useRef<HTMLElement>();

  const width = Math.min(ratio.width / game.data.c | 0, ratio.height / game.data.r | 0);

  return (
    <GameContext.Provider value={{ game, emit, wid: width }}>
      <div
        ref={el => ref.current = el!}
        style={{
          width: width * game.data.c,
          height: width * game.data.r,
          position: 'relative',
        }}
      >
        <Wall walls={data?.grid || []} />
        {data?.snakes.map((snake, i) =>
          <Snake key={i} index={i} snake={[...snake]} couldControl={couldControl?.[i]} color={i ? '#f00' : '#00f'}/>,
        )}
      </div>
    </GameContext.Provider>
  );
});