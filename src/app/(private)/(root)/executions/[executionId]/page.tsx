import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/sever";

import { ExecutionView } from "@/features/executions/components/execution";
import {
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions/components/executions";

import { prefetchExecution } from "@/features/executions/server/prefetch";

interface Props {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionPage({ params }: Props) {
  const { executionId } = await params;

  prefetchExecution(executionId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsError />}>
            <Suspense fallback={<ExecutionsLoading />}>
              <ExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}
