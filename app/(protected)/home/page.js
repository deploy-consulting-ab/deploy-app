'use server';

import { auth } from '@/auth';
import {
    getEffectiveHomeLayoutKey,
    getHomeLayoutForProfile,
} from '@/components/application/home/home-layout-selector';

export default async function HomePage() {
    const session = await auth();
    const user = session.user;
    const { profileId, homeLayoutKey, employeeNumber, yearlyHolidays, carriedOverHolidays, name } =
        user;
    const effectiveHomeLayoutKey = getEffectiveHomeLayoutKey(profileId, homeLayoutKey);
    // Get the appropriate layout component for this profile
    const LayoutComponent = getHomeLayoutForProfile(profileId, homeLayoutKey);

    // Render the specific layout for the profile
    return (
        <LayoutComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}
