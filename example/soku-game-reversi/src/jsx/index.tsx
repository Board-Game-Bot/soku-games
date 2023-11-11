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
  return (
    <GameContext.Provider value={{ game, emit }}>
      <div style={{ width: 800, height: 800, position: 'relative' }} >
        <Grid />
      </div>
    </GameContext.Provider>
  );
});