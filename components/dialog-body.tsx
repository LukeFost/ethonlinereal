"use client";
import React from "react";
import { Button } from "./ui/button";
import ReactFlow from "reactflow";

import TextUpdaterNode from "./function-node";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "textUpdater",
    data: { value: 123 },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const proOptions = { hideAttribution: true };

export function DialogBody() {
  const nodeTypes = React.useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  return (
    <div className="flex flex-col h-[80vh] mx-auto my-auto">
      <div className="flex-grow w-full h-full">
        <ReactFlow
          nodes={initialNodes}
          edges={[]}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable
          proOptions={proOptions}
        />
      </div>
      <div className="flex flex-none justify-end">
        <Button>Submit</Button>
      </div>
    </div>
  );
}
