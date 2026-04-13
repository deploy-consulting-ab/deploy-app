'use server';

import { SystemPermissionsListComponent } from '@/components/application/setup/system-permissions/system-permissions-list';
import { getSystemPermissionsAction } from '@/actions/database/system-permission-actions';
export default async function PermissionsPage() {
    let permissions = null;
    let error = null;
    try {
        permissions = await getSystemPermissionsAction();
    } catch (err) {
        error = err;
    }

    return <SystemPermissionsListComponent permissions={permissions} error={error} />;
}
