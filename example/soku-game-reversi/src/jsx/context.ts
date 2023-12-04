import React from 'react';
import { ReversiGame } from '../core/game';

interface ContextType {
  game?: ReversiGame;
  emit?: (stepStr: string) => void;
}

export const GameContext = React.createContext<ContextType>({});

export const useGameContext = () => React.useContext(GameContext);