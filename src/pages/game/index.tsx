import { Window } from '@/components/window';
import { Controller } from '@/game-redesign/controller.base';
import { getController } from '@/game-redesign/controller.decorator';
import { generate } from '@/game-redesign/data.generator.decorator';
import { createGame } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { ComponentProps, ParentProps, createSignal } from 'solid-js';

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

  const [gameName, setGameName] = createSignal('');

  function startGame() {
    game = createGame(gameName()).setCanvas(canvas);
    (getController('local', 'reversi') as Controller).setGame(game);
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
          ></textarea>
          <Button onClick={init}>init</Button>
        </div>
        <div class={'flex mt-3 gap-2'}>
          <input
            class={'w-[300px]'}
            value={gameName()}
            onChange={(e) => setGameName(e.currentTarget.value)}
            type="text"
          />
          <Button onClick={startGame}>start</Button>
        </div>
        <div class={'flex mt-3 gap-2 items-center'}>
          <input
            class={'w-[300px]'}
            type="text"
            value={step()}
            onChange={(e) => setStep(e.currentTarget.value)}
          />
          <Button onClick={nextStep}>step</Button>
        </div>
      </Window>
    </div>
  );
}
