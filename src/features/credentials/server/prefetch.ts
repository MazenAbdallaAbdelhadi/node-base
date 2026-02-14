import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/sever";

type Input = inferInput<typeof trpc.credentials.getMany>;

/**
 * Prefetch credentials data on the server.
 */
export function prefetchCredentials(input: Input) {
  return prefetch(trpc.credentials.getMany.queryOptions(input));
}

/**
 * Prefetch single credential data on the server.
 */
export function prefetchCredential(id: string) {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
}
