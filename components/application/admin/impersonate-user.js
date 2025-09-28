import { getUsers } from '@/data/user';
import { ImpersonateUserClient } from './impersonate-user-client';

// Server Component
export async function ImpersonateUserContainer() {
    const users = await getUsers();
    return <ImpersonateUserClient users={users} />;
}

// Re-export the client component
export { ImpersonateUserClient as ImpersonateUser };
