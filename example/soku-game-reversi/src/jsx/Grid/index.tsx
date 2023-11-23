import React from 'react';
import { CustomEvent, LifeCycle } from '@soku-games/core';

import { useGameContext } from '../context';
import styles from './index.module.scss';

interface Props {
  couldControl: boolean[];
  ratio: {
    width: number;
    height: number;
  }
}

export const Grid = React.memo((props: Props) => {
  const { game } = useGameContext();
  const [grid, setGrid] = React.useState<number[][]>([]);

  const { ratio } = props;
  const wid = Math.min(
    ratio.width / (game?.data.c ?? 1) | 0,
    ratio.height / (game?.data.r ?? 1) | 0,
  );

  React.useEffect(
    () => {
      game?.subscribe(
        [LifeCycle.AFTER_START, LifeCycle.AFTER_STEP, CustomEvent.CHANGE_SNAPSHOT],
        () => setGrid([...game.data.grid]),
      );
    },
    [game],
  );

  const { emit } = useGameContext();
  const { couldControl } = props;
  function handleClick(i: number, r: number, c: number) {
    if (i !== 2)
      return;
    if (!couldControl[game?.turn ?? 0])
      return;

    emit?.(`${game?.turn}${r}${c}`);
  }

  return (
    <>
      {grid.map((row, rowI) =>
        row.map((value, colI) => 
          <div
            key={`${rowI}${colI}`}
            className={[
              value === 2
                ? styles.cell
                : value
                  ? styles['white-cell']
                  : styles['black-cell'],
            ].join(' ')}
            style={{
              width: wid,
              height: wid,
              top: rowI * wid,
              left: colI * wid,
              backgroundColor: value === 2
                ? '#090'
                : value
                  ? '#ddd'
                  : '#111',
            }}
            onClick={() => handleClick(value, rowI, colI)}
          />,
        ),
      )}
    </>
  );
});
