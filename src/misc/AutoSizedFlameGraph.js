import React, { Fragment, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FlameGraph } from 'react-flame-graph';

export default function AutoSizedFlameGraph({
  data,
  height,
}) {
  return (
    <div
      style={{
        height,
        backgroundColor: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
        borderRadius: '0.5rem',
      }}
    >
      <AutoSizer>
        {({ height: autoSizerHeight, width }) => (
          <Fragment>
            <FlameGraph
              data={data}
              height={autoSizerHeight}
              width={width}
            />
          </Fragment>
        )}
      </AutoSizer>
    </div>
  );
}