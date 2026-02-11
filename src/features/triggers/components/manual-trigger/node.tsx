"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { MousePointerIcon } from "lucide-react";

import { MANULA_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

import { BaseTriggerNode } from "../base-trigger-node";

import { ManualTriggerDialog } from "./dialog";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANULA_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });

  const handleOpenSettings = () => {
    setOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
