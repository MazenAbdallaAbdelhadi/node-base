import { NonRetriableError } from "inngest";

import prisma from "@/lib/prisma";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";

import { getExecutor } from "@/features/executions/lib/executor-registry";

// TRIGGERS
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";

// EXECUTIONS
import { httpRequestChannel } from "./channels/http-request";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";

import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
    onFailure: async ({ event, step }) => {
      await step.run("fail-execution", async () => {
        return prisma.execution.update({
          where: { inngestEventId: event.data.event.id },
          data: {
            status: ExecutionStatus.FAILED,
            error: event.data.error.message,
            errorStack: event.data.error.stack,
          },
        });
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data?.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("EventID or Workflow ID is missing");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Get user id
    const { userId } = await step.run("get-user-id", async () => {
      return prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
    });

    // Initialize the context with any initial data from trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        userId,
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  },
);
