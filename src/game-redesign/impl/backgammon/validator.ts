import { Validator } from '../../validator/base';
import { ValidatorImplement } from '../../validator/decorator';
import { BackgammonGame } from './game';

@ValidatorImplement('backgammon')
export class BackgammonValidator extends Validator {
  checkImpl(s: string): boolean {
    if (!/^(v[0-9a-zA-Z]{2,2}|t|p|d[1-6]{2,2}|d[1-6]{4,4})$/.test(s))
      return false;
    if (['t', 'p', 'd'].includes(s[0])) return true;

    const game = this.game! as BackgammonGame;
    const [f, t] = [parseInt(s[1], 36), parseInt(s[2], 36)];
    const { pieces, dice, turn } = game;

    if (!game.isIn(f) || !game.isIn(t)) return false;
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
      if (game.checkBQ(turn, (!turn && 19) || 1) + pieces[e].length !== 15) {
        return false;
      }
      if (dice.indexOf(step) === -1) {
        const more = Math.max(...dice);

        if (more <= step) return false;
        if (!game.checkWhereOut(turn, f)) return false;

        return true;
      }
    }

    return true;
  }

  afterImpl(s: string): void {
    const game = this.game! as BackgammonGame;
    // 游戏结束？
    if (this.checkIsOver()) {
      return;
    }

    // 跳过？
    if (this.checkPass()) {
      game.step(this.makeDice());
      game.step('p');
      return;
    }

    // 骰子？
    if (!(this.game! as BackgammonGame).dice.length) {
      game.step(this.makeDice());
      game.step(`t`);
    }
  }

  checkIsOver(): boolean {
    const game = this.game! as BackgammonGame;
    const { pieces } = game;
    const winner = [pieces[25].length, pieces[26].length].indexOf(15);

    if (winner === -1) {
      return false;
    }

    const loser = winner ^ 1;

    // 单胜
    if (pieces[26 + loser].length) {
      game.stop(`${winner}方单胜`);
      return true;
    }

    const st = loser * 25;
    const step = !loser ? 1 : -1;
    // 全胜
    for (let i = 0; i <= 6; ++i) {
      const j = st + i * step;

      if (!!pieces[j].length) {
        game.stop(`${winner}方全胜`);
        return true;
      }
    }

    // 完胜
    game.stop(`${winner}方完胜`);
    return true;
  }

  checkPass() {
    const game = this.game! as BackgammonGame;
    const { turn, pieces, dice } = game;

    for (let i = 0; i < 26; ++i) {
      if (pieces[i].length && pieces[i][0].id === turn) {
        for (let d of dice) {
          let t = i + (turn ? -d : d);
          if (t > 25 || t < 0) {
            t = 26 + turn;
          }

          const step = `v${i.toString(36)}${t.toString(36)}`;
          if (this.checkImpl(step)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  makeDice() {
    const dice = new Array(2).fill(0).map(() => (Math.random() * 6 + 1) >> 0);
    if (dice[0] === dice[1]) {
      dice.push(...dice);
    }

    return 'd' + dice.join('');
  }
}
