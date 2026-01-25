"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldGroup } from "@/components/ui/field";

import { LoadingButton } from "@/components/loading-button";
import { FormInput } from "@/components/hook-form";

import { authClient } from "@/lib/auth/auth-client";

import {
  IForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/features/auth/schemas";

export const ForgotPasswordForm = () => {
  const [isPending, transition] = useTransition();

  const form = useForm<IForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: IForgotPasswordSchema) {
    transition(async () => {
      await authClient.requestPasswordReset(
        { ...data },
        {
          onError: (error) => {
            toast.error(
              error.error.message ||
              "Failed to send reset email. Please try again."
            );
          },
          onSuccess: () => {
            toast.success(
              "If an account with that email exists, a reset link has been sent."
            );
          },
        }
      );
    });
  }

  const { isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="example@domain.com"
        />

        <LoadingButton loading={isPending || isSubmitting}>
          Send Reset Email
        </LoadingButton>
      </FieldGroup>
    </form>
  );
};
