import React from 'react';
import { LifeCycle } from '@soku-games/core';
import { SnakeGame } from '../game';
import { SnakeSnapshot } from '../types';
import { Wall } from './Wall';
import { Snake } from './Snake';
import { GameContext } from './context';

interface Props {
  game: SnakeGame;
  emit: (stepStr: string) => void;
  couldControl: boolean[];
}

export const App = React.memo((props: Props) => {
  const { game, couldControl, emit } = props;
  const [data, setData] = React.useState<SnakeSnapshot>();

  React.useEffect(
    () => {
      game.subscribe(LifeCycle.AFTER_START, () => {
        setData({ ...game.data });
      });
      game.subscribe(LifeCycle.AFTER_STEP, () => {
        setData({ ...game.data });
      });
    },
    [],
  );

  const [width, setWidth] = React.useState(0);
  const ref = React.useRef<HTMLElement>();

  React.useEffect(
    () => {
      const el = ref.current!.parentElement!;
      setWidth(Math.min(el.clientWidth / game.data.c | 0, el.clientHeight / game.data.r | 0));
    },
    [],
  );

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
          <Snake key={i} index={i} snake={[...snake]} couldControl={couldControl[i]} color={i ? '#f00' : '#00f'}/>,
        )}
      </div>
    </GameContext.Provider>
  );
});