'use server';

import { UsersListComponent } from '@/components/application/setup/users/users-list';
import { getUsersAction } from '@/actions/user/get-users';
export default async function UsersPage() {
    let users = null;
    let error = null;
    try {
        users = await getUsersAction();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <UsersListComponent users={users} error={error} />
        </div>
    );
}
