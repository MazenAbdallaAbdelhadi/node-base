import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/sever";

import {
  CredentialError,
  CredentialLoading,
  CredentialView,
} from "@/features/credentials/components/credential";
import { prefetchCredential } from "@/features/credentials/server/prefetch";

interface Props {
  params: Promise<{ credentialId: string }>;
}

export default async function CredentialId({ params }: Props) {
  const { credentialId } = await params;
  await prefetchCredential(credentialId);

  return (
    <div className="p-4 max:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gapy-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialError />}>
            <Suspense fallback={<CredentialLoading />}>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}
