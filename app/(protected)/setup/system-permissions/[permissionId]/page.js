'use server';

import { SystemPermissionCardComponent } from '@/components/application/setup/system-permissions/system-permission-card';
import { getSystemPermissionAssignmentsByIdAction } from '@/actions/database/system-permission-actions';

export default async function PermissionPage({ params }) {
    const { permissionId } = await params;

    let permission = null;
    let error = null;

    try {
        permission = await getSystemPermissionAssignmentsByIdAction(permissionId);
    } catch (error) {
        error = error;
    }

    return (
        <div className="py-4">
            <SystemPermissionCardComponent error={error} permission={permission} />
        </div>
    );
}
