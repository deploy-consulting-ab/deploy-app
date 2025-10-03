import { getPermissionSetsAction } from '@/actions/database/permission-set-actions';
import { PermissionSetList } from '@/components/application/setup/permission-sets/permission-set-list';

export default async function PermissionSetsPage() {
    const permissionSets = await getPermissionSetsAction();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Permission Sets</h1>
            </div>
            <PermissionSetList permissionSets={permissionSets} />
        </div>
    );
}
