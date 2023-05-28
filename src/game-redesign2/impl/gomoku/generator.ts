import { Generator } from '../../generator/base';
import { GeneratorImplement } from '../../generator/decorator';

@GeneratorImplement('gomoku')
export class GomokuGenerator extends Generator {
  static do(extra?: any) {
    const { r, c } = extra;

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
