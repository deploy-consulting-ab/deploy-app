'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { AssignmentsListPhoneComponent } from '@/components/application/assignment/phone/assignments-list-phone';
import { AssignmentsListDesktopComponent } from '@/components/application/assignment/assignments-list-desktop';

export function AssignmentsListComponent({ assignments, employeeNumber, error: initialError }) {
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
                error={initialError}
                projectViews={projectViews}
            />
        );
    }

    return (
        <AssignmentsListDesktopComponent
            assignments={assignments}
            employeeNumber={employeeNumber}
            error={initialError}
            projectViews={projectViews}
        />
    );
}
