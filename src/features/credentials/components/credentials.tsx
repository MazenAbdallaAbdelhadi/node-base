"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

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

import { CredentialType } from "@/generated/prisma/browser";
import type { Credential } from "@/generated/prisma/client";

import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useCredentialsParams } from "../hooks/use-credentials-params";

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(item) => item.id}
      emptyView={<CredentialsEmpty />}
      renderItem={(item) => <CredentialItem item={item} />}
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/openai.svg",
  [CredentialType.GEMINI]: "/gemini.svg",
};

const CredentialItem = ({
  item,
}: {
  item: Omit<Omit<Credential, "value">, "userId">;
}) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: item.id });
  };

  const logo = credentialLogos[item.type] || "/openai.svg";

  return (
    <EntityItem
      href={`/credentials/${item.id}`}
      title={item.name}
      subTitle={
        <div>
          Updated {formatDistanceToNow(item.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
        </div>
      }
      image={
        <div className="size-8 flex items-center justify-center bg-foreground rounded-xl">
          <Image src={logo} alt={item.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};

const CredentialsHeader = ({ disable }: { disable?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="create and manage your credentials"
      newButtonHref="/credentials/new"
      newButtonLabel="New Credential"
      disable={disable}
    />
  );
};

const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disable={credentials.isFetching}
      totalPages={credentials.data.pagination.totalPages}
      page={credentials.data.pagination.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <EntityLoadingState message="Loading credentials..." />;
};

export const CredentialsError = () => {
  return <EntityErrorState message="Failed to load credentials." />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/credentials/new`);
  };

  return (
    <EntityEmptyState
      message="You haven't created any credentials yet. Get started by creating your first Credential"
      onNew={handleCreate}
    />
  );
};
