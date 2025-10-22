'use server';

import { SystemPermissionCardComponent } from '@/components/application/setup/system-permissions/system-permission-card';
import { getSystemPermissionAssignmentsByIdAction } from '@/actions/database/system-permission-actions';

export default async function SystemPermissionPage({ params }) {
    const { systemPermissionId } = await params;

    let systemPermission = null;
    let error = null;

    try {
        systemPermission = await getSystemPermissionAssignmentsByIdAction(systemPermissionId);
    } catch (error) {
        error = error;
    }

    return (
        <div className="py-4">
            <SystemPermissionCardComponent error={error} systemPermission={systemPermission} />
        </div>
    );
}
