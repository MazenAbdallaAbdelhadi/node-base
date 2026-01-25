"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Session } from "better-auth";
import { toast } from "sonner";
import { AlertTriangleIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LoadingButton } from "@/components/loading-button";

import { authClient } from "@/lib/auth/auth-client";

import { SessionCard } from "@/features/profile/components/session-card";

export const SessionManagmentForm = ({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  async function revokeOtherSessions() {
    await authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        toast.success("Other Sessions Revoked Successfully");
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Active Sessions</h3>

          {otherSessions.length > 0 && (
            <LoadingButton
              variant="destructive"
              size="sm"
              loading={isPending}
              onClick={() => transition(() => revokeOtherSessions())}
            >
              <AlertTriangleIcon />
              <span>Revoke All Other Sessions</span>
            </LoadingButton>
          )}
        </div>
        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No other Active session
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
