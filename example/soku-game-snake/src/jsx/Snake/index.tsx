import React from 'react';
import { LifeCycle } from '@soku-games/core';
import { P } from '../../types';
import { useGameContext } from '../context';

interface Props {
  index: number;
  snake: P[];
  couldControl?: boolean;
  color?: string;
}

const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];

export const Snake = React.memo((props: Props) => {
  const { snake, couldControl, color, index } = props;
  const [allow, setAllow] = React.useState(true);
  const couldDisplayController = couldControl && allow;

  const { game, emit, wid = 0 } = useGameContext();
  React.useEffect(
    () => {
      game?.subscribe(LifeCycle.AFTER_STEP, () => {
        if (game?.data.dirs.every(i => i === -1))
          setAllow(true);
      });
    },
    [game],
  );

  function handleClick(d: number) {
    setAllow(false);
    emit?.(`${index}${d}`);
  }

  const body = React.useMemo(
    () => {
      const body = [];
      for (let i = 1; i < snake.length; ++i) {
        const cur = snake[i];
        const pre = snake[i - 1];
        const j = dir.findIndex(d => pre[0] + d[0] === cur[0] && pre[1] + d[1] === cur[1]);
        body.push({
          top: j & 1 ? (pre[0] + .2) * wid : (Math.max(pre[0], cur[0]) - .2) * wid,
          left: j & 1 ? (Math.max(pre[1], cur[1]) - .2) * wid : (pre[1] + .2) * wid,
          width: j & 1 ? .4 * wid : .6 * wid,
          height: j & 1 ? .6 * wid : .4 * wid,
        });
      }
      return body;
    },
    [snake, wid],
  );

  return (
    <>
      {snake.map(([x, y], i) =>
        <div
          key={i}
          style={{
            position: 'absolute',
            top: (x + .2) * wid,
            left: (y + .2) * wid,
            width: wid * .6,
            height: wid * .6,
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
      {body.map((body, i) => 
        <div
          key={i}
          style={{
            position: 'absolute',
            ...body,
            transition: '.5s',
            backgroundColor: color,
          }}
        />,
      )}
      {couldDisplayController && dir.map(([dx, dy], i) => 
        <div
          key={i}
          style={{
            position: 'absolute',
            zIndex: 10,
            cursor: 'pointer',
            backgroundColor: color,
            opacity: .2,
            top: (snake[0][0] + dx + .2) * wid,
            left: (snake[0][1] + dy + .2) * wid,
            width: .6 * wid,
            height: .6 * wid,
          }}
          onClick={() => handleClick(i)}
        />,
      )}
    </>
  );
});
