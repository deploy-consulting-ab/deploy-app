'use server';

import { PermissionsListComponent } from '@/components/application/setup/system-permissions/permissions-list';
import { getPermissionsAction } from '@/actions/database/permission-actions';
export default async function PermissionsPage() {
    let permissions = null;
    let error = null;
    try {
        permissions = await getPermissionsAction();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <PermissionsListComponent permissions={permissions} error={error} />
        </div>
    );
}