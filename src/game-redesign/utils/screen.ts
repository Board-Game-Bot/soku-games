import { G } from './g';

export class Screen {
  L = 0;
  width = 0;
  height = 0;
  g: G;
  c: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.g = new G(canvas);
    this.canvas = canvas;
    this.c = canvas.getContext('2d')!;
  }

  updateL() {
    const parent = this.canvas.parentElement!;
    const { clientHeight: h, clientWidth: w } = parent;
    const L = (this.L = Math.min(w / this.width, h / this.height) >> 0);
    const c = this.c;

    Object.assign(c!.canvas, {
      width: this.width * L,
      height: this.height * L,
    });
    c.scale(L, L);
  }

  setAspectRatio(width: number, height: number) {
    this.width = width;
    this.height = height;

    return this;
  }
}
