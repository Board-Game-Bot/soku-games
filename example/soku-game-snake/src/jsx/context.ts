import React from 'react';
import { SnakeGame } from '../game';

interface ContextType {
  game?: SnakeGame;
  emit?: (stepStr: string) => void;
}

export const GameContext = React.createContext<ContextType>({});

export const useGameContext = () => React.useContext(GameContext);