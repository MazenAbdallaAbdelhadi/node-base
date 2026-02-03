"use client";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  ColorMode,
  Panel,
} from "@xyflow/react";
import { useSetAtom } from "jotai";

import {
  EntityErrorState,
  EntityLoadingState,
} from "@/components/entity-components";
import { AddNodeButton } from "@/components/add-node-button";

import { nodeComponents } from "@/constants/node-components";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

import { editorAtom } from "../store/atoms";

import "@xyflow/react/dist/style.css";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const WorkflowEditorLoading = () => {
  return <EntityLoadingState message="Loading Editor..." />;
};

export const WorkflowEditorError = () => {
  return <EntityErrorState message="Failed to load Editor." />;
};

export const WorkflowEditor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const setEditor = useSetAtom(editorAtom);

  const { theme } = useTheme();

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={theme as ColorMode}
        className="bg-background"
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={[1, 2]}
        selectionOnDrag
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Background className="bg-background" />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
