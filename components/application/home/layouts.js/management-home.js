import { getAllAbsenceWithHolidays } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import { getRecentOccupancyRate } from '@/actions/salesforce/salesforce-actions';
import { revalidatePath } from 'next/cache';
import { formatDateToISOString, getUTCToday, transformHolidaysData } from '@/lib/utils';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';
import { HolidaysCardComponent } from '@/components/application/home/dashboard-cards/holidays-card';
import { OccupancyRatesCardComponent } from '@/components/application/home/dashboard-cards/occupancy-rates-card';
import { QuickLinksCardComponent } from '@/components/application/home/dashboard-cards/quick-links-card';

export async function ManagementHomeComponent({ profileId, employeeNumber }) {
    // Initialize data and errors
    let loading = true;

    const data = {
        holidays: null,
        occupancyRates: null,
    };

    const errors = {
        holidays: null,
        occupancyRates: null,
    };

    async function refreshHolidays() {
        'use server';
        revalidatePath('/home');
    }

    async function refreshOccupancy() {
        'use server';
        revalidatePath('/home');
    }

    // Determine what data this profile needs
    const dataRequirements = getHomeRequiredDataForProfile(profileId);
    const links = getHomePageLinks(profileId);

    // Fetch required data based on profile
    if (dataRequirements.holidays) {
        try {
            const absences = await getAllAbsenceWithHolidays(employeeNumber);
            const rawHolidays = absences.holidays;
            data.holidays = transformHolidaysData(rawHolidays);
        } catch (error) {
            errors.holidays = error.message || 'Failed to load holidays';
        }
    }

    if (dataRequirements.occupancyRates) {
        try {
            const today = getUTCToday();
            const formattedToday = formatDateToISOString(today);
            const rawOccupancy = await getRecentOccupancyRate(employeeNumber, formattedToday);
            data.occupancyRates = transformOccupancyData(rawOccupancy);
        } catch (error) {
            errors.occupancyRates = error.message || 'Failed to load occupancy';
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
            {/* Top row: Holidays and Occupancy Rates */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <HolidaysCardComponent
                    holidays={data.holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshHolidays}
                />
                <OccupancyRatesCardComponent
                    occupancy={data.occupancyRates}
                    error={errors.occupancyRates}
                    refreshAction={refreshOccupancy}
                    target={85}
                />
            </div>

            {/* Bottom row: Quick Links */}
            <QuickLinksCardComponent
                title="Quick Access"
                description="Frequently used resources and tools"
                links={quickLinks}
                columns={4}
            />
        </div>
    );
}

// Transform raw occupancy data to match OccupancyRatesCardComponent expected format
function transformOccupancyData(rawData) {
    if (!rawData) return null;

    return {
        currentRate: rawData.current ?? 0,
        previousRate: rawData.history?.[0]?.rate ?? null,
        history:
            rawData.history?.map((item) => ({
                period: item.month,
                rate: item.rate,
            })) ?? [],
    };
}
