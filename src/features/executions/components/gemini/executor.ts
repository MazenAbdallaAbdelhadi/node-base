import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

import { geminiChannel } from "@/inngest/channels/gemini";

import prisma from "@/lib/prisma";

import type { NodeExecutor } from "@/features/executions/types";

import { type IGeminiFormSchema } from "./dialog";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type GeminiData = Partial<IGeminiFormSchema>;

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(geminiChannel().status({ nodeId, status: "loading" }));

  const variableName = data.variableName;

  if (!variableName) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Variable name not configured");
  }

  if (!data.credentialId) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini node: Credential is required");
  }

  if (!data.userPrompt) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini node: User prompt is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });

  if (!credential) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini node: Credential not found");
  }

  const google = createGoogleGenerativeAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model || "gemini-flash-lite-latest"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(geminiChannel().status({ nodeId, status: "success" }));

    return {
      ...context,
      [variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
