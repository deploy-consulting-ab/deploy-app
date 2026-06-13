
import { auth } from '@/auth';
import {
    getHomeLayoutForProfile,
} from '@/components/application/home/home-layout-selector';

export default async function HomePage() {
    const session = await auth();
    const user = session.user;
    const { profileId, homeLayoutKey, yearlyHolidays, carriedOverHolidays } = user;
    const LayoutComponent = getHomeLayoutForProfile(profileId, homeLayoutKey);
    return (
        <LayoutComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}
