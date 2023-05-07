import { GameImplement } from '../../game-implement.decorator';
import { Game } from '../../game.base';
import { IPosition } from '../snake/game';
import { Piece, calcPos } from './piece';
import { Renderer } from './renderer';

@GameImplement('backgammon', 3)
export class BackgammonGame extends Game {
  constructor() {
    super();
  }

  addRendererImpl(): void {
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

  /// TODO:
  validateImpl(s: string): boolean {
    if (!/^(v[0-9a-zA-Z]{2,2}|t|p|d[1-6]{2,2}|d[1-6]{4,4})$/.test(s))
      return false;
    if (['t', 'p', 'd'].includes(s[0])) return true;

    const [f, t] = [parseInt(s[1], 36), parseInt(s[2], 36)];
    const { pieces, dice, turn } = this;

    if (!this.isIn(f) || !this.isIn(t)) return false;
    if (27 - f <= 1) return false;
    if (turn + t === 27) return false;
    // if (i != turn) return false;
    if (!pieces[f].length) return false;
    // CHECK
    if (pieces[f][0].id !== turn) return false;

    const h = turn * 25;
    const e = turn + 26;
    let step = t - f;

    if (!!pieces[h].length && f !== h) return false;
    if (27 - t <= 1) step = (1 - turn) * 25 - f;
    if (turn === 1) step *= -1;
    if (t !== e) {
      if (dice.indexOf(step) === -1) return false;
      if (pieces[t].length > 1 && pieces[t][0].id !== turn) return false;

      return true;
    } else {
      if (this.checkBQ(turn, (!turn && 19) || 1) + pieces[e].length !== 15) {
        return false;
      }
      if (dice.indexOf(step) === -1) {
        const more = Math.max(...dice);

        if (more <= step) return false;
        if (!this.checkWhereOut(turn, f)) return false;

        return true;
      }
    }

    return true;
  }

  checkBQ(i: number, f: number) {
    let c = 0;
    const pieces = this.pieces;

    for (let j = 0; j < 6; ++j) {
      const k = j + f;

      if (!!pieces[k].length && pieces[k][0].id === i) {
        c += pieces[k].length;
      }
    }

    return c;
  }

  checkWhereOut(turn: number, f: number) {
    const stp = turn ? -1 : 1;
    const st = turn ? 6 : 19;
    const pieces = this.pieces;

    for (let i = st; i !== f; i += stp) {
      if (pieces[i].length > 0 && pieces[i][0].id === turn) {
        return false;
      }
    }

    return true;
  }

  isIn(i: number) {
    return 0 <= i && i < 28;
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
