import { getHolidays } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import {
    getAssignmentsMetrics,
    getRecentOccupancyRate,
} from '@/actions/salesforce/salesforce-actions';
import { revalidatePath } from 'next/cache';
import { formatDateToISOString, getUTCToday, transformHolidaysData } from '@/lib/utils';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';
import { HolidaysCardComponent } from '@/components/application/home/dashboard-cards/holidays-card';
import { OccupancyRatesCardComponent } from '@/components/application/home/dashboard-cards/occupancy-rates-card';
import { QuickLinksCardComponent } from '@/components/application/home/dashboard-cards/quick-links-card';
import { StatisticsCardComponent } from '@/components/application/home/dashboard-cards/statistics-card';

export async function ConsultantHomeComponent({
    profileId,
    employeeNumber,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    // Initialize data and errors
    let loading = true;

    const data = {
        holidays: null,
        occupancyRates: null,
        assignmentsMetrics: null,
    };

    const errors = {
        holidays: null,
        occupancyRates: null,
        assignmentsMetrics: null,
    };

    async function refreshHolidays() {
        'use server';
        revalidatePath('/home');
    }

    async function refreshOccupancy() {
        'use server';
        revalidatePath('/home');
    }

    async function refreshStatistics() {
        'use server';
        revalidatePath('/home');
    }

    // Determine what data this profile needs
    const dataRequirements = getHomeRequiredDataForProfile(profileId);
    const links = getHomePageLinks(profileId);

    // Fetch required data based on profile
    if (dataRequirements.holidays) {
        try {
            const rawHolidays = await getHolidays({
                employeeNumber,
                yearlyHolidays,
                carriedOverHolidays,
            });
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

    if (dataRequirements.assignmentsMetrics) {
        try {
            const metrics = await getAssignmentsMetrics(employeeNumber);
            data.assignmentsMetrics = transformStatisticsData(metrics);
        } catch (error) {
            errors.assignmentsMetrics = error.message || 'Failed to load statistics';
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
        <div className="min-h-screen space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Occupancy Rate Card - Team Capacity */}
                    <OccupancyRatesCardComponent
                        occupancy={data.occupancyRates}
                        error={errors.occupancyRates}
                        refreshAction={refreshOccupancy}
                        target={85}
                    />

                    {/* Assignments Card */}
                    <StatisticsCardComponent
                        title="Assignments"
                        stats={data.assignmentsMetrics}
                        error={errors.assignmentsMetrics}
                        refreshAction={refreshStatistics}
                    />
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Holidays Card */}
                    <HolidaysCardComponent
                        holidays={data.holidays}
                        error={errors.holidays}
                        refreshAction={refreshHolidays}
                    />

                    {/* Quick Links */}
                    <QuickLinksCardComponent
                        title="Quick Access"
                        description="Access resources and support anytime"
                        links={quickLinks}
                    />
                </div>
            </div>
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

// Transform raw metrics data to match StatisticsCardComponent expected format
function transformStatisticsData(metrics) {
    if (!metrics || metrics.length === 0) return [];

    return metrics.map((metric) => ({
        id: metric.status,
        label: metric.status,
        value: metric.count,
        detail:
            metric.count === 0
                ? `No ${metric.status.toLowerCase()} assignments`
                : `${metric.count} ${metric.status.toLowerCase()} assignment${metric.count > 1 ? 's' : ''}`,
    }));
}
