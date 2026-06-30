import { SetupHomeComponent } from '@/components/application/setup/setup-home';
import { getUsersAction } from '@/actions/database/user-actions';
import { getTotalProfilesCountAction } from '@/actions/database/profile-actions';
import { getTotalSystemPermissionsCountAction } from '@/actions/database/system-permission-actions';
import { getTotalPermissionSetsCountAction } from '@/actions/database/permissionset-actions';

export default async function SetupPage() {
    let metrics = null;
    let error = null;
    try {
        const [users, totalProfilesCount, totalPermissionsCount, totalPermissionSetsCount] =
            await Promise.all([
                getUsersAction(),
                getTotalProfilesCountAction(),
                getTotalSystemPermissionsCountAction(),
                getTotalPermissionSetsCountAction(),
            ]);

        const activeUsersCount = users.filter((user) => user.isActive).length;
        const totalUsersCount = users.length;

        metrics = {
            activeUsers: activeUsersCount,
            totalUsers: totalUsersCount,
            totalProfiles: totalProfilesCount,
            totalSystemPermissions: totalPermissionsCount,
            totalPermissionSets: totalPermissionSetsCount,
        };
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <SetupHomeComponent metrics={metrics} error={error} />
        </div>
    );
}
