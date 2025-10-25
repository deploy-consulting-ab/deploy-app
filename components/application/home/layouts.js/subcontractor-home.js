'use server';

import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { getSubcontractorAssignmentsMetrics } from '@/actions/salesforce/salesforce-actions';
import { MetricsCardComponent } from '@/components/application/metrics-card';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';

export async function SubcontractorHomeComponent({ profileId, employeeNumber }) {
    let subcontractorAssignmentsMetrics = null;
    let error = null;

    try {
        subcontractorAssignmentsMetrics = await getSubcontractorAssignmentsMetrics(employeeNumber);
    } catch (error) {
        error = error;
    }

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {subcontractorAssignmentsMetrics.map((assignment) => (
                <Link
                    href={`${ASSIGNMENTS_ROUTE}?view=${assignment.status.toLowerCase()}`}
                    key={assignment.status}
                    className="block"
                >
                    <MetricsCardComponent
                        metric={assignment.count}
                        title={assignment.status + ' assignments'}
                        IconComponent={<ClipboardList className="h-4 w-4 text-primary" />}
                        description={`Your ${assignment.status} assignments`}
                    />
                </Link>
            ))}
        </div>
    );
}
