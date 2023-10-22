import React, { useCallback } from "react";
import { useReactFlow } from "reactflow";

export default function ContextMenu({
  onNodeRemove,
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x,
      y: node.position.y,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    onNodeRemove(id);
  }, [id, onNodeRemove]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="bg-white border absolute z-10 shadow-lg"
      {...props}
    >
      <p className="m-2">
        <small>node: {id}</small>
      </p>
      <button
        onClick={duplicateNode}
        className="border-none block px-2 py-1 text-left w-full"
      >
        duplicate
      </button>
      <button
        onClick={deleteNode}
        className="border-none block px-2 py-1 text-left w-full hover:bg-white"
      >
        delete
      </button>
    </div>
  );
}
