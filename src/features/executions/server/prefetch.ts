import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/sever";

type Input = inferInput<typeof trpc.executions.getMany>;

/**
 * Prefetch executions data on the server.
 */
export function prefetchExecutions(input: Input) {
  return prefetch(trpc.credentials.getMany.queryOptions(input));
}

/**
 * Prefetch single execution data on the server.
 */
export function prefetchExecution(id: string) {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
}
