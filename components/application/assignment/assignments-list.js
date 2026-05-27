'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { AssignmentsListPhoneComponent } from '@/components/application/assignment/phone/assignments-list-phone';
import { AssignmentsListDesktopComponent } from '@/components/application/assignment/assignments-list-desktop';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';

export function AssignmentsListComponent({
    assignments,
    employeeNumber,
    error,
    assignmentsMetrics,
    assignmentRoute = ASSIGNMENTS_ROUTE,
}) {
    const isMobile = useIsMobile();

    const projectViews = [
        { value: 'all', label: 'All Assignments' },
        { value: 'not started', label: 'Not Started' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
    ];

    if (isMobile) {
        return (
            <AssignmentsListPhoneComponent
                assignments={assignments}
                employeeNumber={employeeNumber}
                error={error}
                projectViews={projectViews}
                assignmentRoute={assignmentRoute}
            />
        );
    }

    return (
        <AssignmentsListDesktopComponent
            assignments={assignments}
            employeeNumber={employeeNumber}
            error={error}
            projectViews={projectViews}
            assignmentsMetrics={assignmentsMetrics}
            assignmentRoute={assignmentRoute}
        />
    );
}
