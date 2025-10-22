'use server';

import { Card, CardContent } from '@/components/ui/card';
import { ProfilePermissions } from '@/components/application/setup/profiles/profile-permissions';
import { ProfileUserAssignmentsListComponent } from '@/components/application/setup/profiles/profile-user-assignments-list';
import { RecordCardHeaderComponent } from '@/components/application/setup/record-card-header';
import { ProfileCardActionsComponent } from '@/components/application/setup/profiles/profile-card-actions';

export async function ProfileCardComponent({ profile, totalSystemPermissions }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
                <RecordCardHeaderComponent title={profile.name} description={profile.id}>
                    <ProfileCardActionsComponent profile={profile} />
                </RecordCardHeaderComponent>
            </div>

            {/* Profile Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium">Profile Name</h3>
                            <p className="text-sm text-gray-500">{profile.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Profile ID</h3>
                            <p className="text-sm text-gray-500">{profile.id}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Profile Description</h3>
                            <p className="text-sm text-gray-500">{profile.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Card */}
            <ProfilePermissions profile={profile} totalSystemPermissions={totalSystemPermissions} />

            {/* Users in Profile List */}
            <div className="col-span-2">
                <ProfileUserAssignmentsListComponent users={profile.users} profileId={profile.id} />
            </div>
        </div>
    );
}
