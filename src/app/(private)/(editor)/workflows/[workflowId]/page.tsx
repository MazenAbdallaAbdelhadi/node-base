import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import {
  WorkflowEditor,
  WorkflowEditorError,
  WorkflowEditorLoading,
} from "@/features/wokflow-editor/components/editor";
import { WorkflowEditorHeader } from "@/features/wokflow-editor/components/workflow-editor-header";

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
