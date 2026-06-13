import { PermissionSetCardComponent } from '@/components/application/setup/permission-sets/permissionset-card';
import { getPermissionSetByIdAction } from '@/actions/database/permissionset-actions';
import { getSystemPermissionsAction } from '@/actions/database/system-permission-actions';
import { getFieldPermissionsAction } from '@/actions/database/field-permission-actions';

export default async function PermissionSetPage({ params }) {
    const { permissionSetId } = await params;

    let permissionSet = null;
    let error = null;
    let totalSystemPermissions = null;
    let totalFieldPermissions = null;

    try {
        [permissionSet, totalSystemPermissions, totalFieldPermissions] = await Promise.all([
            getPermissionSetByIdAction(permissionSetId),
            getSystemPermissionsAction(),
            getFieldPermissionsAction(),
        ]);
    } catch (err) {
        error = err;
    }

    return (
        <PermissionSetCardComponent
            error={error}
            permissionSet={permissionSet}
            totalSystemPermissions={totalSystemPermissions}
            totalFieldPermissions={totalFieldPermissions}
        />
    );
}
