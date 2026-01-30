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

    console.log('#### dataRequirements', JSON.stringify(dataRequirements, null, 2));

    if (dataRequirements.occupancyRates) {
        try {
            const today = getUTCToday();
            const formattedToday = formatDateToISOString(today);
            const rawOccupancy = await getRecentOccupancyRate(employeeNumber, formattedToday);
            data.occupancyRates = transformOccupancyData(rawOccupancy);

            console.log('#### data.occupancyRates', JSON.stringify(data.occupancyRates, null, 2));
        } catch (error) {
            errors.occupancyRates = error.message || 'Failed to load occupancy';
        }
    }

    if (dataRequirements.assignmentsMetrics) {
        try {
            const metrics = await getAssignmentsMetrics(employeeNumber);
            data.assignmentsMetrics = transformStatisticsData(metrics);

            console.log(
                '#### data.assignmentsMetrics',
                JSON.stringify(data.assignmentsMetrics, null, 2)
            );
        } catch (error) {
            errors.assignmentsMetrics = error.message || 'Failed to load statistics';
        }
    }

    return (
        <div className="min-h-screen space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {/* Main Content - Left Side */}
                <OccupancyRatesCardComponent
                    occupancy={data.occupancyRates}
                    error={errors.occupancyRates}
                    refreshAction={refreshOccupancy}
                    target={85}
                />

                {/* Right Sidebar */}
                <StatisticsCardComponent
                    title="Assignments"
                    stats={data.assignmentsMetrics}
                    error={errors.assignmentsMetrics}
                    refreshAction={refreshStatistics}
                />
            </div>
        </div>
    );
}
