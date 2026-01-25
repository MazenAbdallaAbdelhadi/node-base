import { headers } from "next/headers";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { auth } from "@/lib/auth/auth";
import { AccountLinkingForm } from "./forms/account-linking-form";

export const AccountLinkingCard = async () => {
    const accounts = await auth.api.listUserAccounts({ headers: await headers() });
    const nonCredentialAccounts = accounts.filter((account) => account.providerId !== "credential");

    return (
        <Card className="bg-background border-none shadow-none">
            <CardHeader>
                <CardTitle>Accounts</CardTitle>
                <CardDescription>Manage all your accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <AccountLinkingForm
                    accounts={nonCredentialAccounts}
                />
            </CardContent>
        </Card>
    )
}
