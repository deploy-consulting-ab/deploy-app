import { revalidatePath } from 'next/cache';
import {
    getAssignmentsMetrics,
    getRecentOccupancyRate,
} from '@/actions/salesforce/salesforce-actions';
import {
    formatDateToISOString,
    getUTCToday,
    transformOccupancyData,
    transformStatisticsData,
} from '@/lib/utils';
import { StatisticsCardComponent } from '@/components/application/home/dashboard-cards/statistics-card';
import { OccupancyRatesCardComponent } from '@/components/application/home/dashboard-cards/occupancy-rates-card';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';

export async function SubcontractorHomeComponent({ profileId, employeeNumber }) {
    const data = {
        occupancyRates: null,
        assignmentsMetrics: null,
    };

    const errors = {
        occupancyRates: null,
        assignmentsMetrics: null,
    };

    async function refreshOccupancy() {
        'use server';
        revalidatePath('/home');
    }

    async function refreshStatistics() {
        'use server';
        revalidatePath('/home');
    }

    const dataRequirements = getHomeRequiredDataForProfile(profileId);

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
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Assignments Card */}
                    <StatisticsCardComponent
                        title="Assignments"
                        stats={data.assignmentsMetrics}
                        error={errors.assignmentsMetrics}
                        refreshAction={refreshStatistics}
                    />
                </div>
            </div>
        </div>
    );
}
