import { Validator } from '../../validator/base';
import { ValidatorImplement } from '../../validator/decorator';
import { SnakeGame } from './game';

@ValidatorImplement('snake')
export class SnakeValidator extends Validator {
  checkImpl(s: string): boolean {
    if (!/^[0-3]{2}[0-1]$/.test(s)) {
      return false;
    }

    return true;
  }

  afterImpl(): void {
    const game = this.game! as SnakeGame;
    const { grid } = game;
    const isDead = game.snakes.map(({ cells }, i) => {
      const [hx, hy] = cells[0];

      return (
        grid[hx][hy] === 1 ||
        !!cells.slice(1).find((x) => x[0] === hx && x[1] === hy) ||
        !!game.snakes[1 - i].cells.find((x) => x[0] === hx && x[1] === hy)
      );
    });

    if (isDead.includes(true)) {
      // 一方输了
      if (isDead.includes(false)) {
        const loser = isDead.indexOf(true);

        setTimeout(() => {
          game.stop(`${loser}号蛇碰撞致死`);
        });
      } else {
        setTimeout(() => {
          game.stop(`双方蛇均碰撞致死`);
        });
      }
    }
  }
}
