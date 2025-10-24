'use server';

import { auth } from '@/auth';
import { getHomeLayoutForProfile } from '@/components/application/home/home-layout-selector';

export default async function HomePage() {
    const session = await auth();
    const { profileId, employeeNumber } = session.user;

    // Get the appropriate layout component for this profile
    const LayoutComponent = getHomeLayoutForProfile(profileId);

    // Render the specific layout for the profile
    return <LayoutComponent profileId={profileId} employeeNumber={employeeNumber} />;
}
