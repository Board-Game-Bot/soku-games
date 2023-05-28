import { Game } from '../game.base';
import { Screen } from '../screen';

export abstract class Renderer {
  game?: Game;
  screen?: Screen;
  rendererMap = new Map<string, (dt: number) => void>();

  setScreen(screen: Screen) {
    this.screen = screen;
  }

  setGame(game: Game) {
    let lastT = 0;
    let isStop = false;

    this.game = game;
    game.deps.set('renderer', this);

    const frame = (currentT: number) => {
      this.screen?.updateL();

      if (lastT) {
        const dt = currentT - lastT;
        const renderers = this.rendererMap.values();

        [...renderers].forEach((r) => r(dt / 1000));
      }
      lastT = currentT;

      if (isStop) {
        return;
      }
      window.requestAnimationFrame(frame);
    };

    game.after.on('start', () => {
      this.initImpl();
      window.requestAnimationFrame(frame);
    });
    game.after.on('stop', () => {
      this.game?.deps.delete('renderer');
      isStop = true;
    });
  }

  abstract initImpl(): void;
}
