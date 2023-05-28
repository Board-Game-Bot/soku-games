import { Generator } from '@/game-redesign2/generator/base';
import { GeneratorImplement } from '@/game-redesign2/generator/decorator';

@GeneratorImplement('reversi')
export class ReversiGenerator extends Generator {
  static do(extra: { r: number; c: number }) {
    const { r, c } = extra;

    const grid = new Array(r).fill(0).map((x) => new Array(c).fill(2));
    const mr = r >> 1,
      mc = c >> 1;

    grid[mr - 1][mc] = grid[mr][mc - 1] = 0;
    grid[mr][mc] = grid[mr - 1][mc - 1] = 1;

    return {
      rc: (r << 16) | c,
      mask: grid.toString().replaceAll(',', ''),
    };
  }
}
