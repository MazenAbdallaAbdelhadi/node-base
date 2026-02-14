"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";

import {
  EntityErrorState,
  EntityLoadingState,
} from "@/components/entity-components";
import { LoadingButton } from "@/components/loading-button";
import { FormInput, FormPassword, FormSelect } from "@/components/hook-form";

import { CredentialType } from "@/generated/prisma/enums";

import {
  useCreateCredential,
  useUpdateCredential,
  useSuspenseCredential,
} from "../hooks/use-credentials";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["GEMINI", "OPENAI"]),
  value: z.string().min(1, "API key is required"),
});
type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  credentialId?: string;
  initialData?: {
    name: string;
    type: CredentialType;
    value: string;
  };
}

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/openai.svg",
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/gemini.svg",
  },
];

export const CredentialForm = ({
  credentialId,
  initialData,
}: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!credentialId;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && credentialId) {
      await updateCredential.mutateAsync(
        {
          id: credentialId,
          ...values,
        },
        {
          onSuccess: () => {
            router.push(`/credentials`);
          },
        },
      );
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: () => {
          router.push(`/credentials`);
        },
      });
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit" : "Create"} Credential</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your API key or credential details"
            : "Add a new API key or credential to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="My API key"
            />

            <FormSelect
              control={form.control}
              name="type"
              label="Type"
              placeholder="Select Type"
            >
              {credentialTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={option.logo}
                      alt={option.label}
                      width={16}
                      height={16}
                    />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </FormSelect>

            <FormPassword
              control={form.control}
              name="value"
              label="Value"
              placeholder="sk-•••"
            />

            <div className="flex gap-4 justify-end">
              <LoadingButton
                type="submit"
                className="flex-1 md:flex-none"
                loading={
                  createCredential.isPending || updateCredential.isPending
                }
              >
                {isEdit ? "Update" : "Create"}
              </LoadingButton>

              <Button
                type="button"
                variant="outline"
                className="flex-1 md:flex-none"
                asChild
              >
                <Link href="/credentials">Cancle</Link>
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return (
    <CredentialForm
      credentialId={credential.id}
      initialData={{
        name: credential.name,
        type: credential.type,
        value: credential.value,
      }}
    />
  );
};

export const CredentialLoading = () => {
  return <EntityLoadingState message="Loading credential..." />;
};

export const CredentialError = () => {
  return <EntityErrorState message="Failed to load credential." />;
};
