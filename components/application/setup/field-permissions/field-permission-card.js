import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FieldPermissionAssignmentsListComponent } from '@/components/application/setup/field-permissions/field-permission-assignments-list';
import { RecordCardHeaderComponent } from '@/components/application/setup/record-card-header';
import { FieldPermissionCardActionsComponent } from '@/components/application/setup/field-permissions/field-permission-card-actions';

export async function FieldPermissionCardComponent({ fieldPermission }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
                <RecordCardHeaderComponent
                    title={fieldPermission.label || fieldPermission.fieldName}
                    description={`${fieldPermission.system} / ${fieldPermission.objectName}`}
                >
                    <FieldPermissionCardActionsComponent fieldPermission={fieldPermission} />
                </RecordCardHeaderComponent>
            </div>

            {/* Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">Label</h3>
                                <p className="text-sm text-gray-500">{fieldPermission.label}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Field API Name</h3>
                                <p className="text-sm text-gray-500">{fieldPermission.fieldName}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Description</h3>
                                <p className="text-sm text-gray-500">
                                    {fieldPermission.description || '—'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">System</h3>
                                <Badge variant="outline" className="mt-1">
                                    {fieldPermission.system}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Object Name</h3>
                                <p className="text-sm text-gray-500">
                                    {fieldPermission.objectName}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Permission ID</h3>
                                <p className="text-sm text-gray-500">{fieldPermission.id}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignments List */}
            <div className="col-span-1">
                <FieldPermissionAssignmentsListComponent
                    allAssignments={fieldPermission.allAssignments}
                    fieldPermissionId={fieldPermission.id}
                />
            </div>
        </div>
    );
}
