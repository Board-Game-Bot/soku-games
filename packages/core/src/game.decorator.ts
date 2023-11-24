import { Game } from './game';
import { GamePlugin } from './game-plugin';
import { NewPlugin } from './game-plugin.decorator';

const CONTAINER = new Map<string, typeof Game.constructor>();

export function GameImpl(tag: string): ClassDecorator {
  return (target) => {
    CONTAINER.set(tag, target);
  };
}

function NewGame(tag: string): Game {
  const MAKER = CONTAINER.get(tag);
  if (!MAKER) {
    throw new Error(`The Game \`${tag}\` has not been implemented.`);
  }
  return new (MAKER as any)();
}

interface BuildGameOptions {
  name: string;
  plugins: (
    | string
    | {
        name: string;
        extra?: Record<string, any>;
      }
  )[];
}

export function buildGame(option: BuildGameOptions) {
  try {
    const game = NewGame(option.name);
    option.plugins.forEach((pluginNameOrOption) => {
      let plugin: GamePlugin;
      if (typeof pluginNameOrOption === 'string') {
        plugin = NewPlugin(pluginNameOrOption);
        Object.assign(game.bundler, {
          ...plugin.bindGame(game) ?? {},
        });
      }
      else {
        plugin = NewPlugin(pluginNameOrOption.name);
        Object.assign(game.bundler, {
          ...plugin.bindGame(game, pluginNameOrOption.extra) ?? {},
        });
      }
    });
    return game;
  }
  catch (e) {
    const err = e as Error;
    console.error(err.message);
  }
}
