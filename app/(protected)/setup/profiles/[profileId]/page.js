'use server';

import { ProfileCardComponent } from '@/components/application/setup/profiles/profile-card';
import { getProfileByIdAction } from '@/actions/database/profile-actions';
import { getSystemPermissionsAction } from '@/actions/database/system-permission-actions';
import { getFieldPermissionsAction } from '@/actions/database/field-permission-actions';

export default async function ProfilePage({ params }) {
    const { profileId } = await params;

    let profile = null;
    let error = null;
    let totalSystemPermissions = null;
    let totalFieldPermissions = null;

    try {
        [profile, totalSystemPermissions, totalFieldPermissions] = await Promise.all([
            getProfileByIdAction(profileId),
            getSystemPermissionsAction(),
            getFieldPermissionsAction(),
        ]);
    } catch (err) {
        error = err;
    }

    return (
        <ProfileCardComponent
            error={error}
            profile={profile}
            totalSystemPermissions={totalSystemPermissions}
            totalFieldPermissions={totalFieldPermissions}
        />
    );
}
