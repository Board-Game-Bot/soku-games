import { GamePlugin, GamePluginImpl } from '@soku-games/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SnakeGame } from './game';
import { Extra } from './types';
import { App } from './jsx';

@GamePluginImpl('snake-screen')
export class SnakeScreen extends GamePlugin {
  bindGame(
    game: SnakeGame,
    extra: Extra,
  ): void | Record<string, any> {
    const { el, couldControl, emit } = extra;
    function display() {
      const root = createRoot(el);
      root.render(
        <App game={game} couldControl={couldControl} emit={emit} />,
      );
    }
    display();

    return ;
  }
}
