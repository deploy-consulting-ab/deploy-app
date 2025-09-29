import { UserCardComponent } from '@/components/application/setup/users/user-card';
import { getUserByIdWithPermissions } from '@/data/user';

export default async function UserPage({ params }) {
    const { userId } = await params;

    let user = null;
    let error = null;

    try {
        user = await getUserByIdWithPermissions(userId);
    } catch (err) {
        error = err;
    }

    console.log('#### user', user);

    return (
        <div className="py-4">
            <UserCardComponent error={error} user={user} />
        </div>
    );
}
