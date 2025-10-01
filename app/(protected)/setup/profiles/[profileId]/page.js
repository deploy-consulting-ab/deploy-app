'use server';

import { ProfileCardComponent } from '@/components/application/setup/profiles/profile-card';
import { getProfileByIdAction } from '@/actions/database/profile-actions';

export default async function ProfilePage({ params }) {
    const { profileId } = await params;

    let profile = null;
    let error = null;

    try {
        profile = await getProfileByIdAction(profileId);
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <ProfileCardComponent error={error} profile={profile} />
        </div>
    );
}
