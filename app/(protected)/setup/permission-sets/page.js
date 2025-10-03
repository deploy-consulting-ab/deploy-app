import { getPermissionSetsAction } from '@/actions/database/permissionset-actions';
import { PermissionSetListComponent } from '@/components/application/setup/permission-sets/permissionsets-list';

export default async function PermissionSetsPage() {
    let permissionSets = null;
    let error = null;
    try {
        permissionSets = await getPermissionSetsAction();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <PermissionSetListComponent permissionSets={permissionSets} error={error} />
        </div>
    );
}
