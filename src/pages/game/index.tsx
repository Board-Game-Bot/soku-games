import { Window } from '@/components/window';
import { ComponentProps, ParentProps, createSignal, onMount } from 'solid-js';
import '@/game-redesign';
import {
  Game,
  Screen,
  createController,
  createGame,
  createRenderer,
  createValidator,
  generate,
} from '@/game-redesign';

function Button(props: ParentProps & ComponentProps<'button'>) {
  return (
    <button {...props} class={'rounded-md px-2 py-1 text-sm flex-1'}>
      {props.children}
    </button>
  );
}

export function GameView() {
  let canvas: HTMLCanvasElement;
  let game2: Game;

  const [gameName, setGameName] = createSignal('');

  // test
  onMount(() => {
    const gameName = 'snake';
    game2 = createGame(gameName);

    const renderer = createRenderer(gameName);
    const screen = new Screen(canvas);
    const data = generate(gameName, {
      r: 15,
      c: 15,
      w: 11,
      wallCount: 20,
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

  const [step, setStep] = createSignal('');
  function nextStep() {
    game2.step(step());
  }

  let textarea: HTMLTextAreaElement;
  function init() {
    game2 = createGame(gameName());

    const renderer = createRenderer(gameName());
    const screen = new Screen(canvas);
    const data = generate(gameName(), {
      r: 15,
      c: 15,
      w: 11,
      wallCount: 20,
    });
    const controller = createController(`${gameName()}-local`);
    const validator = createValidator(gameName());

    renderer.setScreen(screen);
    game2
      .setRenderer(renderer)
      .setController(controller)
      .setValidator(validator)
      .init(data)
      .start();
    game2.init(data).start();
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
          <Button onClick={init}>start</Button>
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
