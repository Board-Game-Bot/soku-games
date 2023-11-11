import React from 'react';

interface Props {
  walls: number[][];
}

export const Wall = React.memo((props: Props) => {
  const { walls } = props;
  return (
    <>
      {walls.map((row, rowI) =>
        row.map((value, colI) =>
          <div
            key={`${rowI}${colI}`}
            style={{
              position: 'absolute',
              top: rowI * 50,
              left: colI * 50,
              width: 50,
              height: 50,
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