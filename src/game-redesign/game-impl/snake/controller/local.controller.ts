import { Controller } from '@/game-redesign/controller.base';
import { GameControllerImplement } from '@/game-redesign/controller.decorator';
import { Game } from '@/game-redesign/game.base';

@GameControllerImplement('local', 'snake', 1)
export class SnakeLocalController extends Controller {
  setGame(game: Game): void {
    super.setGame(game);
  }
}
