'use server';

import { Card, CardContent } from '@/components/ui/card';
import { SystemPermissionAssignmentsListComponent } from '@/components/application/setup/system-permissions/system-permission-assignments-list';
import { RecordCardHeaderComponent } from '@/components/application/setup/record-card-header';
import { SystemPermissionCardActionsComponent } from '@/components/application/setup/system-permissions/system-permission-card-actions';

export async function SystemPermissionCardComponent({ permission }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
                <RecordCardHeaderComponent title={permission.name} description={permission.id}>
                    <SystemPermissionCardActionsComponent permission={permission} />
                </RecordCardHeaderComponent>
            </div>

            {/* Permission Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium">Permission Name</h3>
                            <p className="text-sm text-gray-500">{permission.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Permission ID</h3>
                            <p className="text-sm text-gray-500">{permission.id}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Permission Description</h3>
                            <p className="text-sm text-gray-500">{permission.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignments List */}
            <div className="col-span-1">
                <SystemPermissionAssignmentsListComponent
                    allPermissionAssignments={permission.allPermissionAssignments}
                    permissionId={permission.id}
                />
            </div>
        </div>
    );
}