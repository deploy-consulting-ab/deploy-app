import { FieldPermissionsListComponent } from '@/components/application/setup/field-permissions/field-permissions-list';
import { getFieldPermissionsAction } from '@/actions/database/field-permission-actions';

export default async function FieldPermissionsPage() {
    let fieldPermissions = null;
    let error = null;
    try {
        fieldPermissions = await getFieldPermissionsAction();
    } catch (err) {
        error = err;
    }

    return <FieldPermissionsListComponent fieldPermissions={fieldPermissions} error={error} />;
}
