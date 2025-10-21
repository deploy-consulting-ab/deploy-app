'use server';

import { Card, CardContent } from '@/components/ui/card';
import { AllPermissionsCardComponent } from '@/components/application/setup/users/all-permissions-card';
import { UserAssignmentsListComponent } from '@/components/application/setup/users/user-assignments-list';
import { RecordCardHeaderComponent } from '@/components/application/setup/record-card-header';
import Link from 'next/link';
import { UserCardActionsComponent } from '@/components/application/setup/users/user-card-actions';
import { Switch } from '@/components/ui/switch';

export async function UserCardComponent({ user }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
                <RecordCardHeaderComponent title={user.name} description={user.email}>
                    <UserCardActionsComponent user={user} />
                </RecordCardHeaderComponent>
            </div>
            {/* User Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium">Employee Number</h3>
                            <p className="text-sm text-gray-500">{user.employeeNumber}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Profile</h3>
                            <Link
                                href={`/setup/profiles/${user.profileId}`}
                                className="text-sm dark:text-deploy-ocean text-deploy-blue hover:underline mt-1 block"
                            >
                                {user.profileId}
                            </Link>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium pb-2">Is Active</h3>
                            <Switch checked={user.isActive} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Card */}
            <AllPermissionsCardComponent user={user} />

            {/** Permission Sets Card */}
            <UserAssignmentsListComponent permissionSets={user.permissionSets} userId={user.id} />
        </div>
    );
}
