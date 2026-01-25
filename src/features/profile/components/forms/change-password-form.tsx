"use client";

import { useId, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldGroup } from "@/components/ui/field";

import { FormCheckbox, FormPassword } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";

import {
  changePasswordSchema,
  IChangePasswordSchema,
} from "@/features/profile/schemas";

import { authClient } from "@/lib/auth/auth-client";

export const ChangePasswordForm = () => {
  const toastId = useId();
  const [isPending, transition] = useTransition();

  const form = useForm<IChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      revokeOtherSessions: true,
    },
  });

  function onSubmit(data: IChangePasswordSchema) {
    transition(async () => {
      await authClient.changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: data.revokeOtherSessions,
        },
        {
          onRequest: () => {
            toast.loading("Changing Password...", { id: toastId });
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to change password", {
              id: toastId,
            });
          },
          onSuccess: () => {
            toast.success("Password Changed Successfully", { id: toastId });
            form.reset();
          },
        }
      );
    });
  }

  const { isSubmitting, isDirty } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormPassword
          control={form.control}
          name="currentPassword"
          label="Current Password"
          placeholder="••••••••••"
        />
        <FormPassword
          control={form.control}
          name="newPassword"
          label="New Password"
          placeholder="••••••••••"
        />
        <FormPassword
          control={form.control}
          name="newPasswordConfirm"
          label="New Password Confirm"
          placeholder="••••••••••"
        />
        <FormCheckbox
          control={form.control}
          name="revokeOtherSessions"
          label="Logout From other session"
        />

        <LoadingButton
          type="submit"
          className="self-end"
          loading={isSubmitting || isPending}
          disabled={!isDirty}
        >
          Change Password
        </LoadingButton>
      </FieldGroup>
    </form>
  );
};
