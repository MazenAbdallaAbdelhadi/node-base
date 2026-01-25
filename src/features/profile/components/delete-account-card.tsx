"use client";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ActionButton } from "@/components/action-button";

import { authClient } from "@/lib/auth/auth-client";

export const DeleteAccountCard = () => {
  const router = useRouter();

  return (
    <Card className="bg-destructive/5 border-destructive/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-destructive/90">Danger Zone</CardTitle>
        <CardDescription className="text-destructive/90">
          All Actions in this section can&apos;t be reverted
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span>Delete Profile</span>
            <span className="text-xs text-muted-foreground">
              Permenantly delete your profile data
            </span>
          </div>

          <ActionButton
            onAction={async () => {
              await authClient.deleteUser({ callbackURL: "/" });
            }}
            variant="destructive"
            title="Delete Account"
            confirmText="Delete"
            confirmVariant="destructive"
            onSuccess={() => router.push("/register")}
            onError={(error) => console.error("Action failed:", error)}
          >
            <Trash2Icon />
            <span>Delete</span>
          </ActionButton>
        </div>
      </CardContent>
    </Card>
  );
};
