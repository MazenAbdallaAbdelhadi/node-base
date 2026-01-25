import { Suspense } from "react";

import { CardWrapper } from "../card-wrapper";
import { LoginForm } from "../forms/login-form";

export const LoginView = () => {
  return (
    <div className="h-svh flex flex-col items-center justify-center p-4">
      <CardWrapper
        headerLabel="Welcome Back 👋"
        headerCaption="Happy to see you again"
        backButtonLabel="Don't have an account?"
        backButtonHref={"/register"}
        showSocial
      >
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardWrapper>
    </div>
  );
};
