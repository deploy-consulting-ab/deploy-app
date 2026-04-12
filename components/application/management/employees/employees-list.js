'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { EmployeesListPhoneComponent } from '@/components/application/management/employees/phone/employees-list-phone';
import { EmployeesListDesktopComponent } from '@/components/application/management/employees/employees-list-desktop';

export function EmployeesListComponent({ employees, error }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <EmployeesListPhoneComponent
                employees={employees}
                error={error}
            />
        );
    }

    return (
        <EmployeesListDesktopComponent
            employees={employees}
            error={error}
        />
    );
}
