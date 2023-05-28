import { Window } from '@/components/window';
import { getController } from '@/game-redesign/controller.decorator';
import { generate } from '@/game-redesign/data.generator.decorator';
import { createGame } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { ComponentProps, ParentProps, createSignal, onMount } from 'solid-js';
import { Game as Game2 } from '@/game-redesign2/game.base';
import '@/game-redesign2/impl/reversi';
import '@/game-redesign2/impl/backgammon';
import '@/game-redesign2/impl/hex';
import '@/game-redesign2/impl/gomoku';
import { createGame as createGame2 } from '@/game-redesign2/game.decorator';
import { createRenderer } from '@/game-redesign2/renderer/decorator';
import { Screen as Screen2 } from '@/game-redesign2/screen';
import { createController } from '@/game-redesign2/controller/decorator';
import { createValidator } from '@/game-redesign2/validator/decorator';
import { generate as generate2 } from '@/game-redesign2/generator/decorator';

function Button(props: ParentProps & ComponentProps<'button'>) {
  return (
    <button {...props} class={'rounded-md px-2 py-1 text-sm flex-1'}>
      {props.children}
    </button>
  );
}

export function GameView() {
  let canvas: HTMLCanvasElement;
  let game: Game;
  let game2: Game2;

  const [gameName, setGameName] = createSignal('');

  // test
  onMount(() => {
    const gameName = 'gomoku';
    game2 = createGame2(gameName);

    const renderer = createRenderer(gameName);
    const screen = new Screen2(canvas);
    const data = generate2(gameName, {
      r: 15,
      c: 15,
      w: 11,
    });
    const controller = createController(`${gameName}-local`);
    const validator = createValidator(gameName);

    renderer.setScreen(screen);
    game2
      .setRenderer(renderer)
      .setController(controller)
      .setValidator(validator)
      .init(data)
      .start();
  });

  function startGame() {
    if (game) {
      game.stop('');
    }
    game = createGame(gameName())
      .setCanvas(canvas)
      .openValidate(true)
      .setJudgement();

    getController('local', gameName()).setGame(game);

    game.after.on('stop', (reason: string) => {
      console.log(`Game over: ${reason}`);
    });
  }

  const [step, setStep] = createSignal('');
  function nextStep() {
    game.step(step());
  }

  let textarea: HTMLTextAreaElement;
  function init() {
    const data = generate(gameName(), JSON.parse(textarea.value));

    game.init(data).start();
  }

  return (
    <div class={'w-screen h-screen flex flex-col justify-center items-center'}>
      <div
        class={
          'w-[500px] h-[500px] bg-slate-400 rounded-md overflow-hidden flex justify-center items-center'
        }
      >
        <canvas class={'max-w-full max-h-full'} ref={(el) => (canvas = el)} />
      </div>{' '}
      <Window width={400} height={400}>
        <div class={'flex gap-2 mt-3'}>
          <textarea
            ref={(el) => (textarea = el)}
            class={'w-[300px] resize-y'}
            placeholder="Init Data"
          ></textarea>
          <Button onClick={init}>init</Button>
        </div>
        <div class={'flex mt-3 gap-2'}>
          <input
            class="w-[300px] font-serif"
            type="text"
            value={gameName()}
            onChange={(e) => setGameName(e.currentTarget.value)}
            placeholder="game tag"
          />
          <Button onClick={startGame}>start</Button>
        </div>
        <div class={'flex mt-3 gap-2 items-center'}>
          <input
            class="w-[300px] font-serif"
            type="text"
            value={step()}
            onChange={(e) => setStep(e.currentTarget.value)}
            placeholder="step string"
          />
          <Button onClick={nextStep}>step</Button>
        </div>
      </Window>
    </div>
  );
}
