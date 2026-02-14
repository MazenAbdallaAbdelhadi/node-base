import { CredentialForm } from "@/features/credentials/components/credential";

export default function CredentialsNewPage() {
  return (
    <div className="p-4 max:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gapy-y-8 h-full">
        <CredentialForm />
      </div>
    </div>
  );
}
