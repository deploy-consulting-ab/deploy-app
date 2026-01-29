'use server';

import { SubcontractorHomeComponent } from '@/components/application/home/layouts.js/subcontractor-home';
import { ConsultantHomeComponent } from '@/components/application/home/layouts.js/consultant-home';
import { SalesHomeComponent } from '@/components/application/home/layouts.js/sales-home';
import { ManagementHomeComponent } from '@/components/application/home/layouts.js/management-home';
import { AdminHomeComponent } from '@/components/application/home/layouts.js/admin-home';

export async function ConsultantHomeLayout({
    profileId,
    employeeNumber,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <ConsultantHomeComponent
            profileId={profileId}
            employeeNumber={employeeNumber}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function SalesHomeLayout({
    profileId,
    employeeNumber,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <SalesHomeComponent
            profileId={profileId}
            employeeNumber={employeeNumber}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function SubcontractorHomeLayout({
    profileId,
    employeeNumber,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <SubcontractorHomeComponent
            profileId={profileId}
            employeeNumber={employeeNumber}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function ManagementHomeLayout({
    profileId,
    employeeNumber,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <ManagementHomeComponent
            profileId={profileId}
            employeeNumber={employeeNumber}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function AdminHomeLayout({
    profileId,
    employeeNumber,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <AdminHomeComponent
            profileId={profileId}
            employeeNumber={employeeNumber}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}
