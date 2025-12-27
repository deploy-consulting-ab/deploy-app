'use server';

import { Card, CardContent } from '@/components/ui/card';
import { PermissionSetPermissions } from '@/components/application/setup/permission-sets/permissionset-permissions';
import { PermissionSetAssignmentsListComponent } from '@/components/application/setup/permission-sets/permissionset-user-assignments-list';
import { RecordCardHeaderComponent } from '@/components/application/setup/record-card-header';
import { PermissionSetCardActionsComponent } from '@/components/application/setup/permission-sets/permissionset-card-actions';

export async function PermissionSetCardComponent({ permissionSet, totalSystemPermissions }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
                <RecordCardHeaderComponent
                    title={permissionSet.name}
                    description={permissionSet.id}
                >
                    <PermissionSetCardActionsComponent permissionSet={permissionSet} />
                </RecordCardHeaderComponent>
            </div>

            {/* Permission Set Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium">Permission Set Name</h3>
                            <p className="text-sm text-gray-500">{permissionSet.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Permission Set ID</h3>
                            <p className="text-sm text-gray-500">{permissionSet.id}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Permission Set Description</h3>
                            <p className="text-sm text-gray-500">{permissionSet.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Card */}
            <PermissionSetPermissions
                permissionSet={permissionSet}
                totalSystemPermissions={totalSystemPermissions}
            />

            {/* Users List */}
            <div className="col-span-2">
                <PermissionSetAssignmentsListComponent
                    users={permissionSet.users}
                    permissionSetId={permissionSet.id}
                />
            </div>
        </div>
    );
}
