import { getAssignmentTimereportsForOccupancy } from '@/actions/flex/flex-actions';
import { revalidatePath } from 'next/cache';
import { getAssignmentsMetrics } from '@/actions/salesforce/salesforce-actions';
import {
    formatDateToISOString,
    getCurrentFiscalYear,
    getFiscalYearStartDate,
    getUTCToday,
    transformTimereportsToOccupancy,
    transformStatisticsData,
} from '@/lib/utils';
import { StatisticsCardComponent } from '@/components/application/home/dashboard-cards/statistics-card';
import { OccupancyRatesCardComponent } from '@/components/application/home/dashboard-cards/occupancy-rates-card';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';
import { DashboardHeader } from '@/components/application/home/dashboard-header';

export async function SubcontractorHomeComponent({ user }) {
    const { flexEmployeeId, profileId, employeeNumber, name } = user;
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
            const startDate = formatDateToISOString(getFiscalYearStartDate(getCurrentFiscalYear()));
            const endDate = formatDateToISOString(today);
            const rawTimereports = await getAssignmentTimereportsForOccupancy(
                flexEmployeeId,
                startDate,
                endDate
            );
            data.occupancyRates = transformTimereportsToOccupancy(rawTimereports);
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
            <DashboardHeader name={name} />
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
