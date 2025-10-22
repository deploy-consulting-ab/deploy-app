'use server';

import { ProfileCardComponent } from '@/components/application/setup/profiles/profile-card';
import { getProfileByIdAction } from '@/actions/database/profile-actions';
import { getSystemPermissionsAction } from '@/actions/database/system-permission-actions';

export default async function ProfilePage({ params }) {
    const { profileId } = await params;

    let profile = null;
    let error = null;
    let totalSystemPermissions = null;

    try {
        profile = await getProfileByIdAction(profileId);
        totalSystemPermissions = await getSystemPermissionsAction();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <ProfileCardComponent error={error} profile={profile} totalSystemPermissions={totalSystemPermissions} />
        </div>
    );
}
