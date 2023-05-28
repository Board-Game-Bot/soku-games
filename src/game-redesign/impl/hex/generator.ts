import { Generator } from '../../generator/base';
import { GeneratorImplement } from '../../generator/decorator';

@GeneratorImplement('hex')
export class HexGenerator extends Generator {
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
