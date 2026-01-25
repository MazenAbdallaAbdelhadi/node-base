import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CardWrapper } from "../card-wrapper";
import { TotpForm } from "../forms/totp-form";
import { BackupCodeForm } from "../forms/backup-code-form";

export const TwoFactorAuthenticationView = () => {
  return (
    <div className="h-svh flex flex-col items-center justify-center p-4">
      <CardWrapper
        headerLabel="Two-Factor Authentication 🔐"
        headerCaption="Please verify your identity"
        backButtonLabel="Don't have an account?"
        backButtonHref="/register"
      >
        <Tabs defaultValue="totp">
          <TabsList className="w-full grid grid-cols-2 mb-8">
            <TabsTrigger value="totp">Authenticator</TabsTrigger>
            <TabsTrigger value="backup">Backup Code</TabsTrigger>
          </TabsList>

          <TabsContent value="totp">
            <TotpForm />
          </TabsContent>

          <TabsContent value="backup">
            <BackupCodeForm />
          </TabsContent>
        </Tabs>
      </CardWrapper>
    </div>
  );
};
