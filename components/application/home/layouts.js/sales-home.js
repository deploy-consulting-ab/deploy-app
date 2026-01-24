import { getHolidays } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';
import { revalidatePath } from 'next/cache';
import { transformHolidaysData } from '@/lib/utils';
import { HolidaysCardWithRefresh } from '@/components/application/home/dashboard-cards/holidays-card';
import { QuickLinksCardComponent } from '@/components/application/home/dashboard-cards/quick-links-card';

export async function SalesHomeComponent({ profileId, employeeNumber }) {
    // Initialize data and errors
    let loading = true;

    const data = {
        holidays: null,
    };

    const errors = {
        holidays: null,
    };

    async function refreshHolidays() {
        'use server';
        revalidatePath('/home');
    }

    const dataRequirements = getHomeRequiredDataForProfile(profileId);
    const links = getHomePageLinks(profileId);

    if (dataRequirements.holidays) {
        try {
            const rawHolidays = await getHolidays(employeeNumber);
            data.holidays = transformHolidaysData(rawHolidays);
        } catch (error) {
            errors.holidays = error.message || 'Failed to load holidays';
        }
    }

    // Transform quick links to match QuickLinksCard format
    const quickLinks = links.map((link) => ({
        title: link.title,
        description: link.description,
        href: link.href,
        icon: link.icon,
        external: link.target === '_blank',
    }));

    loading = false;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" label="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="h-full grid gap-4">
            {/* Holidays Card */}
            <HolidaysCardWithRefresh
                holidays={data.holidays}
                error={errors.holidays}
                isNavigationDisabled={false}
                refreshAction={refreshHolidays}
            />

            {/* Quick Links */}
            <QuickLinksCardComponent
                title="Quick Access"
                description="Frequently used resources and tools"
                links={quickLinks}
                columns={4}
            />
        </div>
    );
}
