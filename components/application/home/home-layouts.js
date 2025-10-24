'use server';

import { SubcontractorHomeComponent } from '@/components/application/home/layouts.js/subcontractor-home';
import { ConsultantHomeComponent } from '@/components/application/home/layouts.js/consultant-home';
import { SalesHomeComponent } from '@/components/application/home/layouts.js/sales-home';
import { ManagementHomeComponent } from '@/components/application/home/layouts.js/management-home';
import { AdminHomeComponent } from '@/components/application/home/layouts.js/admin-home';

export async function ConsultantHomeLayout({ profileId, employeeNumber }) {
    return <ConsultantHomeComponent profileId={profileId} employeeNumber={employeeNumber} />;
}

export async function SalesHomeLayout({ profileId, employeeNumber }) {
    return <SalesHomeComponent profileId={profileId} employeeNumber={employeeNumber} />;
}

export async function SubcontractorHomeLayout({ profileId, employeeNumber }) {
    return <SubcontractorHomeComponent profileId={profileId} employeeNumber={employeeNumber} />;
}

export async function ManagementHomeLayout({ profileId, employeeNumber }) {
    return <ManagementHomeComponent profileId={profileId} employeeNumber={employeeNumber} />;
}

export async function AdminHomeLayout({ profileId, employeeNumber }) {
    return <AdminHomeComponent profileId={profileId} employeeNumber={employeeNumber} />;
}
