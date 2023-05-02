import { DataGenerator } from '@/game-redesign/data.generator';
import { GeneratorImplement } from '@/game-redesign/data.generator.decorator';

@GeneratorImplement('gomoku', 5)
export class GomokuDataGenerator extends DataGenerator {
  static do(data: { r: number; c: number }) {
    const { r, c } = data;

    const rc = (r << 16) | c;
    const mask = new Array(r)
      .fill(0)
      .map(() => new Array(c).fill(2))
      .toString()
      .replaceAll(',', '');

    return {
      rc,
      mask,
    };
  }
}
