import React from "react";
import { Button } from "./ui/button";

export default function SideBar({ visible }: { visible: boolean }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  if (!visible) return null;

  return (
    <aside className="flex flex-col gap-4 bg-muted p-4 mx-32 rounded-md mb-2">
      <div className="text-lg font-semibold mb-2">
        Drag and drop a Root node to start!
      </div>
      <Button
        onDragStart={(event) => onDragStart(event, "textUpdater")}
        draggable
        hidden={false}
      >
        Stem Node
      </Button>
      {/* <Button
        onDragStart={(event) => onDragStart(event, "rootUpdater")}
        draggable
        hidden={false}
      >
        Root Node
      </Button> */}
    </aside>
  );
}
