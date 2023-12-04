import React from 'react';
import { SnakeGame } from '../core/game.js';

interface ContextType {
  game?: SnakeGame;
  emit?: (stepStr: string) => void;
  wid?: number;
}

export const GameContext = React.createContext<ContextType>({});

export const useGameContext = () => React.useContext(GameContext);