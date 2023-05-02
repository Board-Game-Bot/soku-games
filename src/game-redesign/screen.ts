import { Game } from './game.base';
import { GameObject } from './game.object';

export class Screen extends GameObject {
  _container?: HTMLElement;
  get container() {
    if (!this._container) {
      this._container = this.game.canvas?.parentElement!;
    }
    return this._container;
  }
  constructor(game: Game) {
    super(game);

    this.mkUpdater('get-scale', () => {
      const c = this.c!;
      const { clientHeight: height, clientWidth: width } = this.container;
      const [w, h] = this.aspectRatio;

      const L = (this._L = Math.min(width / w, height / h) >>> 0);
      Object.assign(c.canvas, {
        width: L * w,
        height: L * h,
      });
      
      this._L = L;
    });
    this.mkUpdater('render-screen', () => {
      const L = this._L;
      const g = this.game.g;
      const [w, h] = this.aspectRatio;

      g?.Rect({
        x: 0,
        y: 0,
        lx: L * w,
        ly: L * h,
      });
    });
  }

  _L = 0;
  aspectRatio = [8, 8];
  config(aspectRatio: [number, number]) {
    this.aspectRatio = aspectRatio;
    return this;
  }
}
