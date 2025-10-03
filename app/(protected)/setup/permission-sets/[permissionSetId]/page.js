'use server';

import { PermissionSetCardComponent } from '@/components/application/setup/permission-sets/permission-set-card';
import { getPermissionSetByIdAction } from '@/actions/database/permission-set-actions';
import { getPermissionsAction } from '@/actions/database/permission-actions';

export default async function PermissionSetPage({ params }) {
    const { permissionSetId } = await params;

    let permissionSet = null;
    let error = null;
    let totalPermissions = null;

    try {
        permissionSet = await getPermissionSetByIdAction(permissionSetId);
        totalPermissions = await getPermissionsAction();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <PermissionSetCardComponent
                error={error}
                permissionSet={permissionSet}
                totalPermissions={totalPermissions}
            />
        </div>
    );
}
