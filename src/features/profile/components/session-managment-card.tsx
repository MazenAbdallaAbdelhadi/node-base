import { headers } from "next/headers";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth } from "@/lib/auth/auth";
import { getSession } from "@/lib/auth/get-session";

import { SessionManagmentForm } from "./forms/session-managment-form";

export const SessionManagmentCard = async () => {
  const sessions = await auth.api.listSessions({ headers: await headers() });
  const currentSession = await getSession();

  return (
    <Card className="bg-background border-none shadow-none">
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
        <CardDescription>Manage all your sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <SessionManagmentForm
          sessions={sessions}
          currentSessionToken={currentSession!.session.token}
        />
      </CardContent>
    </Card>
  );
};
