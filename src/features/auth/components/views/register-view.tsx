import { Suspense } from "react";

import { CardWrapper } from "../card-wrapper";
import { RegisterForm } from "../forms/register-form";

export const RegisterView = () => {
  return (
    <div className="h-svh flex flex-col items-center justify-center p-4">
      <CardWrapper
        headerLabel="Create account 👤"
        headerCaption="Let's start our journey"
        backButtonLabel="Already have an account?"
        backButtonHref={"/login"}
        showSocial
      >
        <Suspense>
          <RegisterForm />
        </Suspense>
      </CardWrapper>
    </div>
  );
};
