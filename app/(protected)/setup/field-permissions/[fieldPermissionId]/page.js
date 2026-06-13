
import { FieldPermissionCardComponent } from '@/components/application/setup/field-permissions/field-permission-card';
import { getFieldPermissionAssignmentsByIdAction } from '@/actions/database/field-permission-actions';

export default async function FieldPermissionPage({ params }) {
    const { fieldPermissionId } = await params;

    let fieldPermission = null;
    let error = null;

    try {
        fieldPermission = await getFieldPermissionAssignmentsByIdAction(fieldPermissionId);
    } catch (err) {
        error = err;
    }

    if (error || !fieldPermission) {
        return <div className="text-destructive text-sm p-4">Failed to load field permission.</div>;
    }

    return <FieldPermissionCardComponent fieldPermission={fieldPermission} />;
}
