'use server';

import { Card, CardContent } from '@/components/ui/card';
import { SystemPermissionAssignmentsListComponent } from '@/components/application/setup/system-permissions/system-permission-assignments-list';
import { RecordCardHeaderComponent } from '@/components/application/setup/record-card-header';
import { SystemPermissionCardActionsComponent } from '@/components/application/setup/system-permissions/system-permission-card-actions';

export async function SystemPermissionCardComponent({ systemPermission }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
                <RecordCardHeaderComponent
                    title={systemPermission.name}
                    description={systemPermission.id}
                >
                    <SystemPermissionCardActionsComponent systemPermission={systemPermission} />
                </RecordCardHeaderComponent>
            </div>

            {/* Permission Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium">Permission Name</h3>
                            <p className="text-sm text-gray-500">{systemPermission.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Permission ID</h3>
                            <p className="text-sm text-gray-500">{systemPermission.id}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Permission Description</h3>
                            <p className="text-sm text-gray-500">{systemPermission.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignments List */}
            <div className="col-span-1">
                <SystemPermissionAssignmentsListComponent
                    allSystemPermissionAssignments={systemPermission.allSystemPermissionAssignments}
                    systemPermissionId={systemPermission.id}
                />
            </div>
        </div>
    );
}
