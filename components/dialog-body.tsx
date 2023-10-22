"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  updateEdge,
  addEdge,
  Edge,
  Node,
  useReactFlow,
  Connection,
} from "reactflow";

import { useRecoilState, useRecoilValue } from "recoil";

import cloneDeep from "lodash/cloneDeep";

import TextUpdaterNode from "./function-node";

import TextUpdaterNode2 from "./root-node";

import "reactflow/dist/style.css";
import SideBar from "./SideBar";
import ContextMenu from "./context-menu";
import { dataNode, letConnections, stemDataNode } from "./atom";

type Connection = string[];

const initialNodes: Node<any, string | undefined>[] = [
  {
    id: "dndnode_0",
    position: {
      x: 0,
      y: 0,
    },
    type: "rootUpdater",
    data: {
      label: "node: 0",
    },
  },
];

const initialEdges: Edge<any>[] = [];

const proOptions = { hideAttribution: true };

class LinkedListNode<T> {
  data: T;
  next: LinkedListNode<T> | null = null;
  constructor(data: T) {
    this.data = data;
  }
}

class LinkedList<T> {
  head: LinkedListNode<T> | null = null;

  addNode(data: T) {
    const newNode = new LinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
      return;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
      console.log("current.next", current.next);
    }
  }

  removeNode(data: T) {
    if (!this.head) return;
    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
    }
  }

  removeNodeAndSuccessors(data: T) {
    if (!this.head) return;
    if (this.head.data === data) {
      this.head = null;
      return;
    }

    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }

    if (current.next) {
      current.next = null;
    }
  }
}

function Flow() {
  const [id, setID] = useState(1);
  const getId = () => {
    const newId = `dndnode_${id}`;
    setID(id + 1);
    return newId;
  };
  const inputDataValue = useRecoilValue(dataNode);
  const stemDataValue = useRecoilValue(stemDataNode);
  const [theIconicConnections, setTheIconicConnections] =
    useRecoilState(letConnections);
  const initialLinkedList = new LinkedList<string>();
  initialLinkedList.addNode("dndnode_0");
  const [linkedList, setLinkedList] = useState(initialLinkedList);

  const [edgeDict, setEdgeDict] = useState<Record<string, string[]>>({});

  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();
  const [connections, setConnections] = useState<Connection[]>([]);

  const [menu, setMenu] = useState(null);

  const addEdge = (params: Edge | Connection, els: Edge[]) => {
    if (
      !els.some(
        (edge) => edge.source === params.source && edge.target === params.target
      )
    ) {
      return [...els, params as Edge];
    }
    return els;
  };

  useEffect(() => {
    console.log("Input Data Value", inputDataValue);
    console.log("Stem Data Values", stemDataValue);
    setTheIconicConnections(connections);
    console.log(theIconicConnections);
    return;
  }, [
    inputDataValue,
    stemDataValue,
    connections,
    setTheIconicConnections,
    theIconicConnections,
  ]);

  const onNodeContextMenu = useCallback(
    (
      event: { preventDefault: () => void; clientY: number; clientX: number },
      node: { id: any }
    ) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );
  // close the context menu if open when the window is clicked
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onNodeRemove = useCallback(
    (nodeId: string) => {
      console.log("Removing node with ID:", nodeId);

      let numberOfNodesRemoved = 0;

      setNodes((prevNodes) => {
        const nodeIndex = prevNodes.findIndex((node) => node.id === nodeId);
        console.log("Found node index:", nodeIndex);

        if (nodeIndex !== -1) {
          console.log("Removing node and subsequent nodes from:", nodeIndex);
          const updatedNodes = prevNodes.slice(0, nodeIndex);
          numberOfNodesRemoved = prevNodes.length - updatedNodes.length;
          return updatedNodes;
        }
        return prevNodes;
      });

      // Update the id based on the number of nodes removed
      setID((prevId) => prevId - numberOfNodesRemoved);

      setEdges((prevEdges) => {
        const updatedEdges = prevEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        );
        return updatedEdges;
      });

      setConnections((prevConnections) => {
        const matchingIndex = prevConnections.findIndex((connection) =>
          connection.includes(nodeId)
        );
        console.log("Matching index in connections:", matchingIndex);

        if (matchingIndex !== -1) {
          console.log(
            "Removing connection and subsequent connections from:",
            matchingIndex
          );
          return prevConnections.slice(0, matchingIndex);
        }
        return prevConnections;
      });

      console.log("Current connections after removal:", connections);
    },
    [connections, id, setEdges, setNodes, setID] // Added 'id' and 'setID'
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    try {
      connectingNodeId.current = nodeId;
    } catch (error) {
      console.error("Error during onConnectStart:", error);
    }
  }, []);

  const nodeTypes = React.useMemo(() => {
    try {
      return { textUpdater: TextUpdaterNode, rootUpdater: TextUpdaterNode2 };
    } catch (error) {
      console.error("Error during nodeTypes useMemo calculation:", error);
      return {};
    }
  }, []);

  const handleInit = (instance: React.SetStateAction<null>) => {
    try {
      setReactFlowInstance(instance);
    } catch (error) {
      console.error("Error during handleInit:", error);
    }
  };

  const onDragOver = useCallback((event) => {
    try {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    } catch (error) {
      console.error("Error during onDragOver:", error);
    }
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (!reactFlowBounds) return;
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNodeId = getId();

      const newNode = {
        id: newNodeId,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onEdgeUpdateStart = useCallback(() => {
    try {
      edgeUpdateSuccessful.current = false;
    } catch (error) {
      console.error("Error during onEdgeUpdateStart:", error);
    }
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    try {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    } catch (error) {
      console.error("Error during onEdgeUpdate:", error);
    }
  }, []);

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      try {
        if (!edgeUpdateSuccessful.current) {
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
      } catch (error) {
        console.error("Error during onEdgeUpdateEnd:", error);
      }
    },
    [setEdges]
  );

  const handleConnection = (params: Edge | Connection) => {
    try {
      setEdges((els) => addEdge(params, els));

      setEdgeDict((prevDict) => {
        const newDict = { ...prevDict };
        const src = params.source;
        const tgt = params.target;

        setConnections((prevConnections) => {
          if (prevConnections.length === 0) {
            return [src, tgt];
          } else {
            const lastTarget = prevConnections[prevConnections.length - 1];
            console.log("lastTarget", lastTarget);
            if (src === lastTarget) {
              return [...prevConnections, tgt];
            } else {
              console.log(src, lastTarget, prevConnections);
              console.error(
                "The new connection source does not match the last connection target."
              );
              return prevConnections;
            }
          }
        });

        newDict[src] = [...(newDict[src] || []), params?.target];
      });
    } catch (error) {
      console.error("Error during handleConnection:", error);
    }
  };

  // Utility function to check if a node exists in the linked list
  const linkedListContainsNode = (nodeId: string) => {
    try {
      let current = linkedList.head;
      while (current) {
        if (current.data === nodeId) return true;
        current = current.next;
      }
      return false;
    } catch (error) {
      console.error("Error checking if node exists in linked list:", error);
      return false;
    }
  };

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      try {
        const targetIsPane = event.target as Element; // type cast target to Element

        if (targetIsPane.classList.contains("react-flow__pane")) {
          const { top, left } =
            reactFlowWrapper.current.getBoundingClientRect();
          const id = getId();
          const newNode = {
            id,
            position: project({
              x: event.clientX - left - 75,
              y: event.clientY - top,
            }),
            type: "textUpdater",
            data: { label: `Node ${id}` },
          };

          setNodes((nds) => nds.concat(newNode));
          if (connectingNodeId.current !== null) {
            const newEdge = {
              id,
              source: connectingNodeId.current,
              target: id,
            };
            setEdges((eds) => eds.concat([newEdge as Edge<any>]));
            console.log(edges);
            handleConnection(newEdge);
          }
        }
      } catch (error) {
        console.error("Error during onConnectEnd:", error);
      }
    },
    [edges, getId, handleConnection, project, setEdges, setNodes]
  );

  return (
    <>
      <div className="flex-grow w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={handleInit}
          fitView
          nodesDraggable
          proOptions={proOptions}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodesDelete={onNodeRemove}
        >
          <Controls />
          {menu && (
            <ContextMenu
              onNodeRemove={onNodeRemove}
              onClick={onPaneClick}
              {...menu}
            />
          )}
        </ReactFlow>
      </div>
    </>
  );
}

export function DialogBody() {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const toggleSideBar = () => {
    setIsSideBarVisible(!isSideBarVisible);
  };

  return (
    <>
      <div className="flex flex-col h-[80vh] mx-auto my-auto">
        <ReactFlowProvider>
          <Flow />
          <Button onClick={toggleSideBar}>Draggables</Button>
          <SideBar visible={isSideBarVisible} />
        </ReactFlowProvider>
      </div>
    </>
  );
}
