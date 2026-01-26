"use client";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";

import {
  EntityContainer,
  EntityEmptyState,
  EntityErrorState,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityLoadingState,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";

import { useEntitySearch } from "@/hooks/use-entity-search";

import type { Workflow } from "@/generated/prisma/client";

import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(item) => item.id}
      emptyView={<WorkflowsEmpty />}
      renderItem={(item) => <WorkflowItem item={item} />}
    />
  );
};

const WorkflowItem = ({ item }: { item: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: item.id });
  };

  return (
    <EntityItem
      href={`/workflows/${item.id}`}
      title={item.name}
      subTitle={
        <div>
          Updated {formatDistanceToNow(item.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
        </div>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
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

export const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const handleCreate = () => {
    createWorkflow.mutate();
  };
  return (
    <EntityEmptyState
      message="You haven't created any workflows yet. Get started by creating your first workflow"
      onNew={handleCreate}
    />
  );
};
