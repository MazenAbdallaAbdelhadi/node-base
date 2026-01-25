"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldGroup } from "@/components/ui/field";

import { LoadingButton } from "@/components/loading-button";
import { FormInput, FormPassword } from "@/components/hook-form";

import { authClient } from "@/lib/auth/auth-client";

import { IRegisterSchema, registerSchema } from "@/features/auth/schemas";
import { useReturnTo } from "@/features/auth/hooks";

export const RegisterForm = () => {
  const router = useRouter();

  const [isPending, transition] = useTransition();

  const returnTo = useReturnTo();

  const form = useForm<IRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: IRegisterSchema) {
    transition(async () => {
      await authClient.signUp.email(
        { ...data, callbackURL: returnTo },
        {
          onError: (error) => {
            toast.error(
              error.error.message || "Registration failed. Please try again."
            );
          },
          onSuccess: () => {
            toast.success("Hello there! 👋 Your account has been created.");
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
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="Joe Doe"
        />
        <FormInput
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="example@domain.com"
        />
        <FormPassword
          control={form.control}
          name="password"
          label="Password"
          placeholder="••••••••••"
        />

        <LoadingButton loading={isPending || isSubmitting}>
          Register
        </LoadingButton>
      </FieldGroup>
    </form>
  );
};
