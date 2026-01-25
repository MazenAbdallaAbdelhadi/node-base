"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User } from "better-auth";

import { FieldGroup } from "@/components/ui/field";

import { FormInput } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";

import { IProfileSchema, profileSchema } from "@/features/profile/schemas";

import { authClient } from "@/lib/auth/auth-client";

export const ProfileForm = ({ user }: { user: User }) => {
  const [isPending, transition] = useTransition();

  const form = useForm<IProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  function onSubmit(data: IProfileSchema) {
    transition(async () => {
      const promises = [authClient.updateUser({ name: data.name })];

      if (user.email !== data.email) {
        promises.push(authClient.changeEmail({ newEmail: data.email }));
      }

      const res = await Promise.all(promises);

      const updateUserResult = res[0];
      const emailResult = res[1] ?? { error: false };

      if (updateUserResult.error) {
        toast.error(
          updateUserResult.error.message || "Failed to update profile"
        );
      }

      if (emailResult.error) {
        toast.error(emailResult.error.message || "Failed to update your email");
      }
    });
  }

  const { isSubmitting, isDirty } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Joe Doe"
        />

        <FormInput
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="domain@email.com"
        />

        <LoadingButton
          type="submit"
          className="self-end"
          loading={isSubmitting || isPending}
          disabled={!isDirty}
        >
          Update Profile
        </LoadingButton>
      </FieldGroup>
    </form>
  );
};
