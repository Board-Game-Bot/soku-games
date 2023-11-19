import React from 'react';
import { ReversiGame } from '../game';
import { Extra } from '../types';
import { Grid } from './grid';
import { GameContext } from './context';

interface Props extends Omit<Extra, 'el'> {
  game: ReversiGame;
}

export const App = React.memo((props: Props) => {
  const { game, emit } = props;
  const ref = React.useRef<HTMLElement>();
  const [ratio, setRatio] = React.useState({
    width: 0,
    height: 0,
  });


  React.useEffect(
    () => {
      const el = ref.current?.parentElement;
      setRatio({
        width: el?.clientWidth ?? 0,
        height: el?.clientHeight ?? 0,
      });
    },
    [],
  );

  const height = (ratio.height / game.data?.r | 0) * game.data?.r;

  const aspectRatio = `${game.data.r}/${game.data.c}`;

  return (
    <GameContext.Provider value={{ game, emit }}>
      <div ref={el => ref.current = el!} style={{ height, aspectRatio, position: 'relative' }} >
        <Grid ratio={ratio} couldControl={props.couldControl} />
      </div>
    </GameContext.Provider>
  );
});