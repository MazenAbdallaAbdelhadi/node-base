"use client";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

import {
  EntityContainer,
  EntityEmptyState,
  EntityErrorState,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityLoadingState,
  EntityPagination,
} from "@/components/entity-components";

import { Execution, ExecutionStatus } from "@/generated/prisma/browser";

import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(item) => item.id}
      emptyView={<ExecutionsEmpty />}
      renderItem={(item) => <ExecutionItem item={item} />}
    />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formateStatus = (status: ExecutionStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

const ExecutionItem = ({
  item,
}: {
  item: Execution & { workflow: { id: string; name: string } };
}) => {
  const duration = item.completedAt
    ? Math.round(
        (new Date(item.completedAt).getTime() -
          new Date(item.startedAt).getTime()) /
          1000,
      )
    : null;

  const subtitle = (
    <>
      {item.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(item.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s</>}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${item.id}`}
      title={formateStatus(item.status)}
      subTitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(item.status)}
        </div>
      }
    />
  );
};

const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow execution history"
    />
  );
};

const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disable={executions.isFetching}
      totalPages={executions.data.pagination.totalPages}
      page={executions.data.pagination.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <EntityLoadingState message="Loading executions..." />;
};

export const ExecutionsError = () => {
  return <EntityErrorState message="Failed to load executions." />;
};

export const ExecutionsEmpty = () => {
  return (
    <EntityEmptyState message="You haven't created any executions yet. Get started by running your first workflow" />
  );
};
