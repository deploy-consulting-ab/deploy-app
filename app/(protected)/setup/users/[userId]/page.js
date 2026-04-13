'use server';

import { UserCardComponent } from '@/components/application/setup/users/user-card';
import { getUserByIdWithSystemPermissionsAction } from '@/actions/database/user-actions';
export default async function UserPage({ params }) {
    const { userId } = await params;

    let user = null;
    let error = null;

    try {
        user = await getUserByIdWithSystemPermissionsAction(userId);
    } catch (err) {
        error = err;
    }

    return <UserCardComponent error={error} user={user} />;
}
