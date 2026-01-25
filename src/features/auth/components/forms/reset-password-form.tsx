"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldGroup } from "@/components/ui/field";

import { LoadingButton } from "@/components/loading-button";
import { FormPassword } from "@/components/hook-form";

import { authClient } from "@/lib/auth/auth-client";

import {
  IResetPasswordSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, transition] = useTransition();

  const form = useForm<IResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") || "",
      newPassword: "",
    },
  });

  function onSubmit(data: IResetPasswordSchema) {
    transition(async () => {
      await authClient.resetPassword(
        { ...data },
        {
          onError: (error) => {
            toast.error(
              error.error.message || "Password reset failed. Please try again."
            );
          },
          onSuccess: () => {
            toast.success("Password has been reset successfully.");
            router.push("/login");
          },
        }
      );
    });
  }

  const { isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormPassword
          control={form.control}
          name="newPassword"
          label="New Password"
          placeholder="••••••••••"
        />

        <LoadingButton loading={isPending || isSubmitting}>
          Reset password
        </LoadingButton>
      </FieldGroup>
    </form>
  );
};
