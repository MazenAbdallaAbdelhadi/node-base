"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldGroup } from "@/components/ui/field";

import { LoadingButton } from "@/components/loading-button";
import { FormInput } from "@/components/hook-form";

import { authClient } from "@/lib/auth/auth-client";

import { IBackupCodeSchema, backupCodeSchema } from "@/features/auth/schemas";
import { useReturnTo } from "@/features/auth/hooks";

export const BackupCodeForm = () => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const returnTo = useReturnTo();

  const form = useForm<IBackupCodeSchema>({
    resolver: zodResolver(backupCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(data: IBackupCodeSchema) {
    transition(async () => {
      await authClient.twoFactor.verifyBackupCode(
        { ...data },
        {
          onError: (error) => {
            toast.error(
              error.error.message || "Verification failed. Please try again."
            );
          },
          onSuccess: () => {
            toast.success("Verified successfully.");
            router.push(returnTo);
          },
        }
      );
    });
  }

  const { isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput control={form.control} name="code" label="Backup Code" />

        <LoadingButton loading={isPending || isSubmitting}>
          Verify
        </LoadingButton>
      </FieldGroup>
    </form>
  );
};
