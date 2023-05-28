import { DataGenerator } from '../../data.generator';
import { GeneratorImplement } from '../../data.generator.decorator';

@GeneratorImplement('reversi', 2)
export class ReversiDataGenerator extends DataGenerator {
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
