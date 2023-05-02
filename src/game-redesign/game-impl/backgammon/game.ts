import { GameImplement } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { Piece, calcPos } from './piece';
import { IPosition } from '@/game-redesign/c';
import { Renderer } from './renderer';

@GameImplement('backgammon', 3)
export class BackgammonGame extends Game {
  constructor() {
    super();

    this.before.on('start', () => {
      new Renderer(this);
    });
  }

  turn = 0;
  dice = <number[]>[];
  pieces = <Piece[][]>new Array(28).fill(0).map(() => []);
  initImpl(data: { mask: string; start: number; dice: string }): void {
    const { mask, start, dice } = data;

    this.turn = start;
    this.dice = dice.split('').map((x) => +x);

    for (let i = 0; i < 26; ++i) {
      const [typ, cnt] = [
        parseInt(mask[i << 1], 36),
        parseInt(mask[(i << 1) | 1], 36),
      ];
      for (let j = 0; j < cnt; ++j) {
        this.addPieceIn(i, typ);
      }
    }

    this.screen?.config([14, 11]);
  }

  stepImpl(s: string): void {
    'v.{from}.{to}';
    'd.{dices}';
    't';
    'p';
    const type = s[0];
    switch (type) {
      case 'v':
        {
          const [f, t] = [parseInt(s[1], 36), parseInt(s[2], 36)];
          this.move(s, f, t);
        }
        break;
      case 'd':
        {
          const dice = s
            .slice(1)
            .split('')
            .map((x) => +x);
          this.setDice(s, dice);
        }
        break;
      case 't':
      case 'p':
        {
          this.changeTurn(s);
        }
        break;
    }
  }

  addPieceIn(pos: number, typ: number) {
    const pieces = this.pieces;

    pieces[pos].push(
      new Piece(this, {
        id: typ,
        p: calcPos(pos, pieces[pos].length + 1),
      })
    );
  }

  move(s: string, f: number, t: number, isEat?: boolean) {
    const pieces = this.pieces;
    if (!pieces[f].length)
      throw new Error(`GameError: piece in ${f} is empty.`);

    const p = pieces[f].pop()!;
    const moved = <IPosition[]>[];
    // eat
    if (pieces[t].length === 1 && pieces[t][0].id !== p.id) {
      const q = pieces[t][0];
      moved.push([t, q.id * 25]);
      this.move(s, t, q.id * 25, true);
    }

    pieces[t].push(p);
    moved.push([f, t]);
    p.moveTo(t, pieces[t].length);

    if (!isEat) {
      if (t >= 27) t = 25 * (1 - p.id);

      const len = Math.abs(t - f);
      const dice = this.dice;
      let i = dice.indexOf(len);
      if (i === -1) {
        i = 0;
      }
      const num = dice[i];
      dice.splice(i, 1);

      this.pushStep(s, () => {
        while (moved.length) {
          const [f, t] = moved.pop()!;
          const chess = pieces[t].pop()!;
          pieces[f].push(chess);
          chess.moveTo(f, pieces[t].length);
        }
        this.dice.splice(i, 0, num);
      });
    }
  }

  setDice(s: string, dice: number[]) {
    const oldDice = [...this.dice];

    this.dice = dice;
    this.pushStep(s, () => {
      this.dice = oldDice;
    });
  }

  changeTurn(s: string) {
    this.turn ^= 1;

    this.pushStep(s, () => {
      this.turn ^= 1;
    });
  }
}
