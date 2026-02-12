"use client";
import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

import { useNodeStatus } from "../../hooks/use-node-status";

import { BaseExecutionNode } from "../base-execution-node";

import {
  AVAILABLE_MODELS,
  OpenAiDialog,
  type IOpenAiFormSchema,
} from "./dialog";
import { fetchOpenAiRealtimeToken } from "./actions";

type OpenAINodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAINodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAiRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);
  const handleSubmit = (values: IOpenAiFormSchema) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }

        return node;
      }),
    );
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]} : ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <OpenAiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        status={nodeStatus}
        icon={"/openai.svg"}
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAiNode.displayName = "OpenAiNode";
