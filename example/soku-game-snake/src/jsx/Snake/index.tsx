import React from 'react';
import { LifeCycle } from '@soku-games/core';
import { P } from '../../types';
import { useGameContext } from '../context';

interface Props {
  index: number;
  snake: P[];
  couldControl: boolean;
  color?: string;
}

const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];

export const Snake = React.memo((props: Props) => {
  const { snake, couldControl, color, index } = props;
  const [allow, setAllow] = React.useState(true);
  const couldDisplayController = couldControl && allow;

  const { game, emit } = useGameContext();
  React.useEffect(
    () => {
      game?.subscribe(LifeCycle.AFTER_STEP, () => {
        setAllow(true);
      });
    },
    [game],
  );

  function handleClick(d: number) {
    setAllow(false);
    emit?.(`${index}${d}`);
  }

  return (
    <>
      {snake.map(([x, y], i) =>
        <div
          key={i}
          style={{
            position: 'absolute',
            top: x * 50 + 10,
            left: y * 50 + 10,
            width: 30,
            height: 30,
            backgroundColor: color ?? '#000',
            transition: '.5s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!i && 
            <div
              style={{
                backgroundColor: '#000',
                width: '50%',
                height: '50%',
              }}
            />
          }
        </div>,
      )}
      {couldDisplayController && dir.map(([dx, dy], i) => 
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            cursor: 'pointer',
            backgroundColor: color,
            opacity: .2,
            top: (snake[0][0] + dx) * 50 + 10,
            left: (snake[0][1] + dy) * 50 + 10,
            width: 30,
            height: 30,
          }}
          onClick={() => handleClick(i)}
        />,
      )}
    </>
  );
});
