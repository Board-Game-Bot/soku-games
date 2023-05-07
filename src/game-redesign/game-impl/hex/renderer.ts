import { GameObject } from '../../game.object';
import { getPosition, HexGame } from './game';

export class Renderer extends GameObject {
  constructor(game: HexGame) {
    super(game);

    this.mkUpdater('render-bg', () => {
      const g = game.g!;
      const L = this.L!;

      g.Rect({
        y: 0,
        x: 0,
        ly: 32 * L,
        lx: 20 * L,
        color: '#cca',
      });
    });

    this.mkUpdater('render-current', () => {
      const L = this.L!;
      const g = game.g!;

      if (!game.currentPosition) return;

      const [cx, cy] = game.currentPosition;
      const { x, y } = getPosition(cx, cy);

      g.Hex({
        x: x * L,
        y: y * L,
        radius: 0.6 * L,
        color: game.turn ? '#00f' : '#f00',
      });
    });

    this.mkUpdater('render-grid', () => {
      const g = game.g!;
      const L = this.L!;
      const w = game.w;
      const grid = game.grid;

      new Array(w).fill(0).forEach((_, i) => {
        new Array(w).fill(0).forEach((_, j) => {
          const { x, y } = getPosition(i, j);
          g.StrokeHex({
            x: x * L,
            y: y * L,
            radius: 1 * L,
            width: 0.1 * L,
            color: '#111',
          });
          if (grid[i][j] !== 2) {
            g.Hex({
              x: x * L,
              y: y * L,
              radius: 0.7 * L,
              color: grid[i][j] ? '#00f' : '#f00',
            });
          }
        });
      });
    });

    this.mkUpdater('render-border', () => {
      const L = this.L!;
      const g = game.g!;

      let lst: [number, number][] = [];
      new Array(11).fill(0).forEach((_, idx) => {
        lst.push(
          [(10 + idx * 0.866) * L, idx * 1.5 * L],
          [(10 + (idx + 1) * 0.866) * L, (0.5 + idx * 1.5) * L]
        );
      });
      lst.push([19.526 * L, 16 * L]);
      g.Segs({
        ps: lst,
        width: 0.2 * L,
        color: '#f00',
      });
      lst = [];
      new Array(11).fill(0).forEach((_, idx) => {
        lst.push(
          [(10 - idx * 0.866) * L, (32 - idx * 1.5) * L],
          [(10 - (idx + 1) * 0.866) * L, (32 - 0.5 - idx * 1.5) * L]
        );
      });
      lst.push([0.474 * L, 16 * L]);
      g.Segs({
        ps: lst,
        width: 0.2 * L,
        color: '#f00',
      });
      lst = [];
      new Array(11).fill(0).forEach((_, idx) => {
        lst.push(
          [(10 + idx * 0.866) * L, (32 - idx * 1.5) * L],
          [(10 + (idx + 1) * 0.866) * L, (32 - 0.5 - idx * 1.5) * L]
        );
      });
      lst.push([19.526 * L, 16 * L]);
      g.Segs({
        ps: lst,
        width: 0.2 * L,
        color: '#00f',
      });
      lst = [];
      new Array(11).fill(0).forEach((_, idx) => {
        lst.push(
          [(10 - idx * 0.866) * L, idx * 1.5 * L],
          [(10 - (idx + 1) * 0.866) * L, (0.5 + idx * 1.5) * L]
        );
      });
      lst.push([0.474 * L, 16 * L]);
      g.Segs({
        ps: lst,
        width: 0.2 * L,
        color: '#00f',
      });
    });

    this.mkUpdater('render-first', () => {
      const L = this.L!;
      const g = game.g!;
      const { x, y } = getPosition(1, 2);

      g.StrokeHex({
        x: x * L,
        y: y * L,
        radius: 0.8 * L,
        width: 0.4 * L,
        color: '#912',
      });
    });
  }
}
