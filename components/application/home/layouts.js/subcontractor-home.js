'use server';

import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { getAssignmentsMetrics } from '@/actions/salesforce/salesforce-actions';
import { AssignmentsMetricsComponent } from '@/components/application/assignment/assignments-metrics';

export async function SubcontractorHomeComponent({ employeeNumber }) {
    let subcontractorAssignmentsMetrics = null;
    let error = null;

    try {
        const metrics = await getAssignmentsMetrics(employeeNumber);

        subcontractorAssignmentsMetrics = metrics.map((assignment) => ({
            ...assignment,
            title: assignment.status + ' assignments',
            description:
                assignment.count === 0
                    ? `No ${assignment.status} assignments yet`
                    : `Click to view ${assignment.status} assignments`,
        }));
    } catch (error) {
        error = error;
    }

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <div className="h-full py-4">
            <h3 className="text-base md:text-lg font-medium">Assignments Metrics</h3>
            <AssignmentsMetricsComponent
                assignmentsMetrics={subcontractorAssignmentsMetrics}
                className="grid-cols-2"
            />
        </div>
    );
}
