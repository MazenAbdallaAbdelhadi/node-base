import Link from "next/link";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

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
// -------------------------------
// -------------------------------

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
// -------------------------------
// -------------------------------

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
// -------------------------------
// -------------------------------

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
// -------------------------------
// -------------------------------

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
// -------------------------------
// -------------------------------

export const EntityErrorState: React.FC<ViewState> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
// -------------------------------
// -------------------------------

interface EmptyStateProps extends ViewState {
  onNew?: () => void;
}

export const EntityEmptyState: React.FC<EmptyStateProps> = ({
  message,
  onNew,
}) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
        <EmptyTitle>No items</EmptyTitle>
        {!!message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>

      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew} variant="outline">
            <PlusIcon className="size-4" />
            <span>Create new</span>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
// -------------------------------
// -------------------------------

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  className,
  emptyView,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
// -------------------------------
// -------------------------------

interface EntityItemProps {
  href: string;
  title: string;
  subTitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem: React.FC<EntityItemProps> = ({
  href,
  title,
  subTitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) {
      return;
    }

    if (onRemove) {
      await onRemove();
    }
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving && "opacity-50 pointer-events-none cursor-not-allowed",
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {!!subTitle && (
                <CardDescription className="text-xs">
                  {subTitle}
                </CardDescription>
              )}
            </div>
          </div>

          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onClick={handleRemove}>
                      <TrashIcon className="size-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
// -------------------------------
// -------------------------------