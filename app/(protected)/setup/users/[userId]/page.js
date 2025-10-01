'use server';

import { UserCardComponent } from '@/components/application/setup/users/user-card';
import { getUserByIdWithPermissionsAction } from '@/actions/database/user-actions';
export default async function UserPage({ params }) {
    const { userId } = await params;

    let user = null;
    let error = null;

    try {
        user = await getUserByIdWithPermissionsAction(userId);
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <UserCardComponent error={error} user={user} />
        </div>
    );
}
