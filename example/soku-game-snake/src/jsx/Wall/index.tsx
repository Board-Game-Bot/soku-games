import React from 'react';
import { useGameContext } from '../context';

interface Props {
  walls: number[][];
}

export const Wall = React.memo((props: Props) => {
  const { walls } = props;
  const { wid = 0 } = useGameContext();

  return (
    <>
      {walls.map((row, rowI) =>
        row.map((value, colI) =>
          <div
            key={`${rowI}${colI}`}
            style={{
              position: 'absolute',
              top: rowI * wid,
              left: colI * wid,
              width: wid,
              height: wid,
              backgroundColor: value
                ? '#c91'
                : rowI + colI & 1
                  ? '#ccc'
                  : '#eee',
            }}
          />,
        ),
      )}
    </>
  );
});