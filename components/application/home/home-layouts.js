'use server';

import { SubcontractorHomeComponent } from '@/components/application/home/layouts.js/subcontractor-home';
import { ConsultantHomeComponent } from '@/components/application/home/layouts.js/consultant-home';
import { SalesHomeComponent } from '@/components/application/home/layouts.js/sales-home';
import { ManagementHomeComponent } from '@/components/application/home/layouts.js/management-home';
import { AdminHomeComponent } from '@/components/application/home/layouts.js/admin-home';

export async function ConsultantHomeLayout({
    user,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <ConsultantHomeComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function SalesHomeLayout({
    user,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <SalesHomeComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function SubcontractorHomeLayout({
    user,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <SubcontractorHomeComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function ManagementHomeLayout({
    user,
    yearlyHolidays,
    carriedOverHolidays,
}) {
    return (
        <ManagementHomeComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}

export async function AdminHomeLayout({ user, yearlyHolidays, carriedOverHolidays }) {
    return (
        <AdminHomeComponent
            user={user}
            yearlyHolidays={yearlyHolidays}
            carriedOverHolidays={carriedOverHolidays}
        />
    );
}
