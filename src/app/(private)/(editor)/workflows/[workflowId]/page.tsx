import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import {
  WorkflowEditor,
  WorkflowEditorError,
  WorkflowEditorHeader,
  WorkflowEditorLoading,
} from "@/features/wokflow-editor/components/editor";

import { HydrateClient } from "@/trpc/sever";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;

  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<WorkflowEditorError />}>
        <Suspense fallback={<WorkflowEditorLoading />}>
          <WorkflowEditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <WorkflowEditor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
