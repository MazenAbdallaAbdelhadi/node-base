import { Suspense } from "react";
import { CardWrapper } from "../card-wrapper";
import { ResetPasswordForm } from "../forms/reset-password-form";

export const ResetPasswordView = () => {
  return (
    <div className="h-svh flex flex-col items-center justify-center p-4">
      <CardWrapper
        headerLabel="Reset Your Password 🔒"
        headerCaption="Let's get you back in"
        backButtonLabel="Back to Login"
        backButtonHref={"/login"}
      >
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </CardWrapper>
    </div>
  );
};
