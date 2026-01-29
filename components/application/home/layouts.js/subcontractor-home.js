import { revalidatePath } from 'next/cache';
import { getAssignmentsMetrics } from '@/actions/salesforce/salesforce-actions';
import { transformStatisticsData } from '@/lib/utils';
import { StatisticsCardComponent } from '@/components/application/home/dashboard-cards/statistics-card';

export async function SubcontractorHomeComponent({ employeeNumber }) {
    let statsData = null;
    let error = null;

    async function refreshStatistics() {
        'use server';
        revalidatePath('/home');
    }

    try {
        const metrics = await getAssignmentsMetrics(employeeNumber);
        statsData = transformStatisticsData(metrics);
    } catch (err) {
        error = err.message || 'Failed to load statistics';
    }

    return (
        <div className="h-full py-4">
            <StatisticsCardComponent
                title="Assignments Overview"
                description="Your current assignment metrics"
                stats={statsData}
                error={error}
                refreshAction={refreshStatistics}
                columns={2}
            />
        </div>
    );
}
