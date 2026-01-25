import { CardWrapper } from "../card-wrapper";
import { ForgotPasswordForm } from "../forms/forgot-password-form";

export const ForgotPasswordView = () => {
  return (
    <div className="h-svh flex flex-col items-center justify-center p-4">
      <CardWrapper
        headerLabel="Forgot Your Password 😢"
        headerCaption="Don't worry, it happens to the best of us"
        backButtonLabel="Back to Login"
        backButtonHref={"/login"}
        showSocial
      >
        <ForgotPasswordForm />
      </CardWrapper>
    </div>
  );
};
