import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type SearchParams } from "nuqs/server";

import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

import { HydrateClient } from "@/trpc/sever";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function WorkflowsPage({ searchParams }: Props) {
  const params = await workflowsParamsLoader(searchParams);

  prefetchWorkflows(params);

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
