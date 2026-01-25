import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession } from '@/lib/auth/get-session'

import { SetPasswordButton } from './set-password-button'

export const SetPasswordCard = async () => {
    const session = await getSession();

    if (!session) return null;

    return (
        <Card className="bg-background border-none shadow-none">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your password for imporved security.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SetPasswordButton email={session?.user?.email} />
            </CardContent>
        </Card>
    )
}
