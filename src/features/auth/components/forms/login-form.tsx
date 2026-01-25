"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { FormInput, RHFField } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";

import { authClient } from "@/lib/auth/auth-client";

import { ILoginSchema, loginSchema } from "@/features/auth/schemas";
import { useReturnTo } from "@/features/auth/hooks";

export const LoginForm = () => {
  const router = useRouter();

  const [isPending, transition] = useTransition();

  const returnTo = useReturnTo();

  const form = useForm<ILoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: ILoginSchema) {
    transition(async () => {
      await authClient.signIn.email(
        { ...data, callbackURL: returnTo },
        {
          onError: (error) => {
            toast.error(
              error.error.message || "Login failed. Please try again."
            );
          },
          onSuccess: () => {
            toast.success("Welcome back 🤗");
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
          name="email"
          type="email"
          label="Email"
          placeholder="example@domain.com"
        />

        <RHFField control={form.control} name="password">
          {(field, fieldState) => {
            const errorElement = fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            );

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent className="flex flex-row justify-between items-center">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Button variant={"link"} className="text-sm p-0" asChild>
                    <Link href={"/forgot-password"}>Forgot Password?</Link>
                  </Button>
                </FieldContent>

                <PasswordInput {...field} placeholder="••••••••••" />

                {errorElement}
              </Field>
            );
          }}
        </RHFField>

        <LoadingButton loading={isPending || isSubmitting}>Login</LoadingButton>
      </FieldGroup>
    </form>
  );
};
