import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/sever";

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetch workflows data on the server.
 */
export function prefetchWorkflows(input: Input) {
  return prefetch(trpc.workflows.getMany.queryOptions(input));
}

/**
 * Prefetch single workflow data on the server.
 */
export function prefetchWorkflow(id: string) {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
}
