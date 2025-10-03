import { getPermissionSetByIdAction } from '@/actions/database/permission-set-actions';
import { PermissionSetForm } from '@/components/application/setup/permission-sets/permission-set-form';
import { PermissionSetUsers } from '@/components/application/setup/permission-sets/permission-set-users';
import { PermissionSetPermissions } from '@/components/application/setup/permission-sets/permission-set-permissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function PermissionSetPage({ params }) {
    const permissionSet = await getPermissionSetByIdAction(params.id);

    if (!permissionSet) {
        return <div>Permission Set not found.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{permissionSet.name}</h1>
            </div>

            <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <PermissionSetForm permissionSet={permissionSet} />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <PermissionSetUsers permissionSet={permissionSet} />
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                    <PermissionSetPermissions permissionSet={permissionSet} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
