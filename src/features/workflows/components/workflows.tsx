"use client";
import { useRouter } from "next/navigation";

import {
  EntityContainer,
  EntityErrorState,
  EntityHeader,
  EntityLoadingState,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import { JsonViewer } from "@/components/json-viewer";

import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <div>
      <JsonViewer obj={workflows.data} />
    </div>
  );
};

export const WorkflowsHeader = ({ disable }: { disable?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();

  function handleCreateWorkflow() {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
    });
  }

  return (
    <EntityHeader
      title="Workflows"
      description="create and manage your workflows"
      onNew={handleCreateWorkflow}
      newButtonLabel="New Workflow"
      disable={disable}
      isCreating={createWorkflow.isPending}
    />
  );
};

const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disable={workflows.isFetching}
      totalPages={workflows.data.pagination.totalPages}
      page={workflows.data.pagination.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsLoading = () => {
  return <EntityLoadingState message="Loading Workflows..." />;
};

export const WorkflowsError = () => {
  return <EntityErrorState message="Failed to load Workflows." />;
};
