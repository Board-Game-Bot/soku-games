import { generate } from '@/game-redesign/data.generator.decorator';
import { createGame } from '@/game-redesign/game-implement.decorator';
import { Game } from '@/game-redesign/game.base';
import { createSignal } from 'solid-js';

export function GameView() {
  let canvas: HTMLCanvasElement;
  let game: Game;

  const [gameName, setGameName] = createSignal('');

  function startGame() {
    const data = generate(gameName(), {
      r: 12,
      c: 13,
      wallCount: 15,
    });
    game = createGame(gameName()).setCanvas(canvas).init(data).start();
  }

  const [step, setStep] = createSignal('');
  function nextStep() {
    game.step(step());
  }

  return (
    <div class={'w-screen h-screen flex flex-col justify-center items-center'}>
      <div
        class={'w-[500px] h-[500px] bg-slate-400 rounded-md overflow-hidden'}
      >
        <canvas class={'w-full h-full'} ref={(el) => (canvas = el)} />
      </div>
      <div>
        <input
          class={'w-[300px] mt-3'}
          value={gameName()}
          onChange={(e) => setGameName(e.currentTarget.value)}
          type="text"
        />
      </div>
      <div class={'flex mt-3 gap-2 items-center'}>
        <input
          type="text"
          value={step()}
          onChange={(e) => setStep(e.currentTarget.value)}
        />
        <button onClick={nextStep} class={'rounded-md px-2 py-1 text-sm'}>
          step
        </button>
      </div>
      <button onClick={startGame} class={'mt-6'}>
        start
      </button>
    </div>
  );
}
