import { getAssignmentsMetrics } from '@/actions/salesforce/salesforce-actions';
import { StatisticsCardComponent } from '@/components/application/home/dashboard-cards/statistics-card';

export async function SubcontractorHomeComponent({ employeeNumber }) {
    let statsData = null;
    let error = null;

    async function refreshStatistics() {
        'use server';
        try {
            const metrics = await getAssignmentsMetrics(employeeNumber);
            return transformStatisticsData(metrics);
        } catch (err) {
            throw new Error(err.message);
        }
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
