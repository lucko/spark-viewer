import React, { Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FlameGraph } from 'react-flame-graph';

export default function AutoSizedFlameGraph({
  data,
  height,
}) {
  return (
    <div
      className='flame'
      style={{ height }}
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