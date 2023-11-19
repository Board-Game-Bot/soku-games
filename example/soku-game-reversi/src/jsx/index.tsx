import React from 'react';
import { LifeCycle } from '@soku-games/core';
import { ReversiGame } from '../game';
import { Extra } from '../types';
import { Grid } from './grid';
import { GameContext } from './context';

interface Props extends Omit<Extra, 'el'> {
  game: ReversiGame;
  ratio: {
    width: number;
    height: number;
  }
}

export const App = React.memo((props: Props) => {
  const { game, emit, ratio } = props;
  const ref = React.useRef<HTMLElement>();
  const [wid, setWid] = React.useState(0);

  React.useEffect(
    () => {
      game.subscribe(LifeCycle.AFTER_START, () => {
        const wid = Math.min(ratio.height / game.data.r | 0, ratio.width / game.data.c | 0);
        setWid(wid);
      });
    },
    [],
  );

  return (
    <GameContext.Provider value={{ game, emit }}>
      <div
        ref={el => ref.current = el!}
        style={{
          width: wid * game.data.c,
          height: wid * game.data.r,
          position: 'relative',
        }}
      >
        <Grid ratio={ratio} couldControl={props.couldControl} />
      </div>
    </GameContext.Provider>
  );
});