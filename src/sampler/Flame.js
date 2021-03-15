import React, { Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FlameGraph } from 'react-flame-graph';
import { resolveMappings } from './mappings';

export default function Flame({ flameData, mappings }) {
  const data = buildFlameGraph(flameData, mappings);
  return (
    <div className='flame' style={{ height: 'calc(100vh - 140px)' }}>
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

function buildFlameGraph(node, mappings) {
  const {
      thread, native,
      className, methodName,
      packageName, lambda
  } = resolveMappings(node, mappings);

  const obj = {};
  if (thread) {
      obj.name = node.name;
  } else if (native) {
      obj.name = node.methodName + ' (native)';
  } else {
      obj.name = (packageName ? packageName : '') + className + (lambda ? lambda : '') + '.' + methodName + '()'
      obj.tooltip = node.className + '.' + node.methodName + '() - ' + node.time + 'ms';
  }

  obj.value = node.time;
  obj.children = [];

  for (const child of node.children) {
      obj.children.push(buildFlameGraph(child, mappings));
  }

  return obj;
}