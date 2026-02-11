import { channel, topic } from "@inngest/realtime";

export const MANULA_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";
export const manualTriggerChannel = channel(
  MANULA_TRIGGER_CHANNEL_NAME,
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
  