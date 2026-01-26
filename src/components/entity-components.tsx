import Link from "next/link";
import {
  AlertTriangleIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { LoadingButton } from "./loading-button";

type EntytyHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disable?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader: React.FC<EntytyHeaderProps> = ({
  title,
  description,
  disable,
  isCreating,
  newButtonLabel,
  newButtonHref,
  onNew,
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {!!description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {!!onNew && !newButtonHref && (
        <LoadingButton
          loading={isCreating}
          disabled={disable || isCreating}
          onClick={onNew}
        >
          <PlusIcon className="size-4" />
          <span>{newButtonLabel}</span>
        </LoadingButton>
      )}

      {!onNew && !!newButtonHref && (
        <Button disabled={disable || isCreating} onClick={onNew} asChild>
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            <span>{newButtonLabel}</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntytyContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer: React.FC<EntytyContainerProps> = ({
  header,
  search,
  pagination,
  children,
}) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const EntitySearch: React.FC<EntitySearchProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <InputGroup className="ml-auto bg-background shadow-none max-w-50">
      <InputGroupAddon>
        <SearchIcon className="size-3.5 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  );
};

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disable?: boolean;
};

export const EntityPagination: React.FC<EntityPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  disable,
}) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          disabled={disable || page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={disable || page >= totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface ViewState {
  message?: string;
}

export const EntityLoadingState: React.FC<ViewState> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const EntityErrorState: React.FC<ViewState> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
