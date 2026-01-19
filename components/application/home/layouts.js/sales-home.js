import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';
import { transformHolidaysData } from '@/lib/utils';
import {
    HolidaysCardComponent,
    QuickLinksCardComponent,
} from '@/components/application/home/dashboard-cards';

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
        try {
            const rawData = await getAbsenceApplications(employeeNumber);
            return transformHolidaysData(rawData);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const dataRequirements = getHomeRequiredDataForProfile(profileId);
    const links = getHomePageLinks(profileId);

    if (dataRequirements.holidays) {
        try {
            const rawHolidays = await getAbsenceApplications(employeeNumber);
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
            <HolidaysCardComponent
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
