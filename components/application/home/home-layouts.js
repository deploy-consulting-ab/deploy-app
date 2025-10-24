'use server';

import { SubcontractorHomeComponent } from '@/components/application/home/layouts.js/subcontractor-home';
import { ConsultantHomeComponent } from '@/components/application/home/layouts.js/consultant-home';
import { SalesHomeComponent } from '@/components/application/home/layouts.js/sales-home';
import { ManagementHomeComponent } from '@/components/application/home/layouts.js/management-home';
import { AdminHomeComponent } from '@/components/application/home/layouts.js/admin-home';

export async function ConsultantHomeLayout({
    holidays,
    occupancyRates,
    errors,
    refreshActions,
    links,
}) {
    return (
        <ConsultantHomeComponent
            holidays={holidays}
            occupancyRates={occupancyRates}
            errors={errors}
            refreshActions={refreshActions}
            links={links}
        />
    );
}

export async function SalesHomeLayout({ holidays, errors, refreshActions, links }) {
    return (
        <SalesHomeComponent
            holidays={holidays}
            errors={errors}
            refreshActions={refreshActions}
            links={links}
        />
    );
}

export async function SubcontractorHomeLayout({ holidays, errors, refreshActions }) {
    return (
        <SubcontractorHomeComponent
            holidays={holidays}
            errors={errors}
            refreshActions={refreshActions}
        />
    );
}

export async function ManagementHomeLayout({
    holidays,
    occupancyRates,
    errors,
    refreshActions,
    links,
}) {
    return (
        <ManagementHomeComponent
            holidays={holidays}
            occupancyRates={occupancyRates}
            errors={errors}
            refreshActions={refreshActions}
            links={links}
        />
    );
}

export async function AdminHomeLayout({ holidays, occupancyRates, errors, refreshActions, links }) {
    // Admin sees everything plus has admin-specific quick links
    return (
        <AdminHomeComponent
            holidays={holidays}
            occupancyRates={occupancyRates}
            errors={errors}
            refreshActions={refreshActions}
            links={links}
        />
    );
}
