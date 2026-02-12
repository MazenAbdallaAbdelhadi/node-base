import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/executions/types";

import { httpRequestChannel } from "@/inngest/channels/http-request";

import { IHttpRequestFormSchema } from "./dialog";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type HttpRequestData = Partial<IHttpRequestFormSchema>;

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: "loading" }));

  const variableName = data.variableName;

  if (!data.endpoint) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  if (!data.method) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("HTTP Request node: No method configured");
  }

  if (!variableName) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Variable name not configured");
  }

  try {
    const result = await step.run("http-request", async () => {
      const template = Handlebars.compile(data.endpoint!);
      const endpoint: string = template(context);

      if (!endpoint || typeof endpoint !== "string") {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Endpoint template must resolve to a no-empty string",
        );
      }

      const method = data.method || "GET";

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        if (data.body) {
          const resolved = Handlebars.compile(data.body)(context);
          JSON.parse(resolved);

          options.body = resolved;
          options.headers = {
            "Content-Type": "application/json",
          };
        }
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");

      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [variableName]: responsePayload,
      };
    });

    await publish(httpRequestChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
