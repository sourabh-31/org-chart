"use client";

import "@xyflow/react/dist/style.css";

import type {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlowInstance,
} from "@xyflow/react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import dagre from "dagre";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useChartStore } from "@/store/useChartStore";
import CustomMainNode from "./CustomMainNode";
import CustomChildNode from "./CustomChildNode";
import CustomSmallNode from "./CustomSmallNode";
import CustomSmoothEdge from "./CustomSmoothEdge";

interface NodeDimension {
  width?: number;
  height?: number;
}

// Helper function to get all descendant nodes of a given node
const getDescendantNodes = (nodeId: string, edges: Edge[]): string[] => {
  const directChildren = edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);
  let allDescendants = [...directChildren];

  // Recursively get all descendants
  directChildren.forEach((childId) => {
    allDescendants = [...allDescendants, ...getDescendantNodes(childId, edges)];
  });

  return allDescendants;
};

// Helper function to check if a node or any of its ancestors is collapsed
const isNodeOrAncestorCollapsed = (
  nodeId: string,
  collapsedNodes: Set<string>,
  edges: Edge[]
): boolean => {
  const parentEdge = edges.find((edge) => edge.target === nodeId);
  if (!parentEdge) return false;
  if (collapsedNodes.has(parentEdge.source)) return true;
  return isNodeOrAncestorCollapsed(parentEdge.source, collapsedNodes, edges);
};

// Function to calculate the layout using Dagre.js
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[]
): { layoutedNodes: Node[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  // Configure node dimensions
  nodes.forEach((node) => {
    const { width = 300, height = 150 }: NodeDimension =
      node.data?.dimensions || {};
    dagreGraph.setNode(node.id, { width, height });
  });

  // Add edges to Dagre graph
  edges.forEach(({ source, target }) => {
    dagreGraph.setEdge(source, target);
  });

  dagre.layout(dagreGraph);

  // Return nodes with updated positions
  return {
    layoutedNodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x: position.x, y: position.y },
        style: {
          ...node.style,
          width: position.width,
          height: position.height,
        },
      };
    }),
  };
};

export default function OrgChart() {
  const [nodes, setNodes] = useState<Node[]>(() => {
    const storedData = localStorage.getItem("convertedData");
    return storedData ? JSON.parse(storedData).nodes : [];
  });

  const [edges, setEdges] = useState<Edge[]>(() => {
    const storedData = localStorage.getItem("convertedData");
    return storedData ? JSON.parse(storedData).edges : [];
  });

  const { chartData, rerender } = useChartStore();
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const updateChart = useCallback(() => {
    const storedData = localStorage.getItem("convertedData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setNodes(parsedData.nodes);
      setEdges(parsedData.edges);

      setTimeout(() => {
        if (reactFlowInstance.current) {
          reactFlowInstance.current.fitView({ duration: 500 });
        }
      }, 0);
    }
  }, []);

  useEffect(() => {
    updateChart();
  }, [updateChart, chartData]);

  // Apply layout on nodes and edges whenever the nodes/edges length changes
  useEffect(() => {
    const { layoutedNodes } = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
  }, [nodes.length, edges.length, rerender]);

  // Filter visible nodes based on collapsed state of ancestors
  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      return !isNodeOrAncestorCollapsed(node.id, collapsedNodes, edges);
    });
  }, [nodes, edges, collapsedNodes]);

  // Toggle collapse/expand state for node and its descendants
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setCollapsedNodes((prev) => {
        const newCollapsed = new Set(prev);

        if (newCollapsed.has(node.id)) {
          // Expand node and its descendants
          newCollapsed.delete(node.id);
          const descendants = getDescendantNodes(node.id, edges);
          descendants.forEach((descendantId) => {
            newCollapsed.delete(descendantId);
          });
        } else {
          // Collapse node and its descendants
          newCollapsed.add(node.id);
          const descendants = getDescendantNodes(node.id, edges);
          descendants.forEach((descendantId) => {
            newCollapsed.add(descendantId);
          });
        }

        return newCollapsed;
      });
    },
    [edges]
  );

  const nodeTypes = useMemo(
    () => ({
      customMainNode: (props: any) => (
        <CustomMainNode {...props} onNodeClick={onNodeClick} />
      ),
      customChildNode: (props: any) => (
        <CustomChildNode {...props} onNodeClick={onNodeClick} />
      ),
      customSmallNode: (props: any) => (
        <CustomSmallNode {...props} onNodeClick={onNodeClick} />
      ),
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      smoothStep: CustomSmoothEdge,
    }),
    []
  );

  return (
    <section className="min-h-screen w-full">
      <div className="h-screen">
        <ReactFlow
          onInit={(instance) => {
            reactFlowInstance.current = instance;
          }}
          nodes={visibleNodes}
          edges={edges}
          onNodesChange={(changes: NodeChange[]) =>
            setNodes((nds) => applyNodeChanges(changes, nds))
          }
          onEdgesChange={(changes: EdgeChange[]) =>
            setEdges((eds) => applyEdgeChanges(changes, eds))
          }
          fitView
          nodesConnectable={false}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: "smoothStep" }}
          nodesDraggable={false}
          maxZoom={1.5}
          minZoom={0.35}
        >
          <Controls
            style={{ top: 0, right: 10, left: "auto", bottom: "auto" }}
            showInteractive={false}
          />
        </ReactFlow>
      </div>
    </section>
  );
}
