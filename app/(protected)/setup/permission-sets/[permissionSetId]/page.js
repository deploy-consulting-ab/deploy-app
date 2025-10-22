'use server';

import { PermissionSetCardComponent } from '@/components/application/setup/permission-sets/permissionset-card';
import { getPermissionSetByIdAction } from '@/actions/database/permissionset-actions';
import { getSystemPermissionsAction } from '@/actions/database/system-permission-actions';

export default async function PermissionSetPage({ params }) {
    const { permissionSetId } = await params;

    let permissionSet = null;
    let error = null;
    let totalSystemPermissions = null;

    try {
        permissionSet = await getPermissionSetByIdAction(permissionSetId);
        totalSystemPermissions = await getSystemPermissionsAction();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <PermissionSetCardComponent
                error={error}
                permissionSet={permissionSet}
                totalSystemPermissions={totalSystemPermissions}
            />
        </div>
    );
}
