import { DataGenerator } from '../../data.generator';
import { GeneratorImplement } from '../../data.generator.decorator';

@GeneratorImplement('backgammon', 3)
export class BackgammonDataGenerator extends DataGenerator {
  static do(extra?: any) {
    const dice = new Array(2).fill(0).map(() => {
      return ((Math.random() * 6) >>> 0) + 1;
    });
    dice[0] === dice[1] && dice.push(...dice);

    const start = (Math.random() * 2) >>> 0;
    const pieces = <number[][]>new Array(28).fill(0).map(() => []);

    function repeat(n: number, fn: Function) {
      for (let i = 0; i < n; ++i) {
        fn();
      }
    }

    repeat(2, () => {
      pieces[1].push(0);
      pieces[24].push(1);
    });
    repeat(3, () => {
      pieces[17].push(0);
      pieces[8].push(1);
    });
    repeat(5, () => {
      pieces[12].push(0);
      pieces[19].push(0);
      pieces[6].push(1);
      pieces[13].push(1);
    });

    const data = {
      dice: dice.join(''),
      start,
      mask: pieces
        .map((x) => (x.length && `${x[0]}${x.length.toString(36)}`) || '20')
        .join(''),
    };
    return data;
  }
}
