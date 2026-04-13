'use server';

import { ProfilesListComponent } from '@/components/application/setup/profiles/profiles-list';
import { getProfilesAction } from '@/actions/database/profile-actions';
export default async function ProfilesPage() {
    let profiles = null;
    let error = null;
    try {
        profiles = await getProfilesAction();
    } catch (err) {
        error = err;
    }

    return <ProfilesListComponent profiles={profiles} error={error} />;
}
