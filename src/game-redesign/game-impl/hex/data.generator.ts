import { GeneratorImplement } from '@/game-redesign/data.generator.decorator';

@GeneratorImplement('hex', 4)
export class HexDataGenerator {
  static do({ w }: { w: number }) {
    const mask = new Array(w)
      .fill(0)
      .map(() => new Array(w).fill(2))
      .toString()
      .replaceAll(',', '');
    return {
      w,
      mask,
    };
  }
}
