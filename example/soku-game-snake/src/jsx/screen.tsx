import { GamePlugin, GamePluginImpl } from '@soku-games/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SnakeGame } from '../core/game.js';
import { Extra } from '../core/types.js';
import { App } from './index.js';

@GamePluginImpl('snake-screen')
export class SnakeScreen extends GamePlugin {
  bindGame(
    game: SnakeGame,
    extra: Extra,
  ): void | Record<string, any> {
    const { el, couldControl, emit } = extra;
    function display() {
      const root = createRoot(el);
      const ratio = {
        width: el.clientWidth,
        height: el.clientHeight,
      };
      root.render(
        <App ratio={ratio} game={game} couldControl={couldControl} emit={emit} />,
      );
    }
    display();

    return ;
  }
}
