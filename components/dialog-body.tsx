"use client";
import React from "react";
import { Button } from "./ui/button";
import ReactFlow from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const proOptions = { hideAttribution: true };

export function DialogBody() {
  return (
    <div className="flex flex-col h-[80vh] mx-auto my-auto">
      <div className="flex-grow w-full h-full">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
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
