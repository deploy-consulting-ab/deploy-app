'use server';

import Link from 'next/link';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';
import { MetricsCardComponent } from '@/components/application/metrics-card';
import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

export async function AssignmentsMetricsComponent({ assignmentsMetrics, className }) {
    return (
        <div className={cn('grid gap-3 md:gap-4 py-4', className)}>
            {assignmentsMetrics.map((assignment) => (
                <Link
                    href={`${ASSIGNMENTS_ROUTE}?view=${assignment.status.toLowerCase()}`}
                    key={assignment.status}
                    className="block h-full"
                >
                    <MetricsCardComponent
                        metric={assignment.count}
                        title={assignment.title}
                        IconComponent={
                            <ClipboardList className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                        }
                        description={assignment.description}
                    />
                </Link>
            ))}
        </div>
    );
}
