import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeCheckIcon } from 'lucide-react';
import { populatePermissions } from '@/lib/utils';

export function PermissionsEditableCardComponent({
    entityName,
    entityPermissions,
    totalPermissions,
}) {
    const permissions = populatePermissions(entityPermissions, totalPermissions);   

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Permissions for {entityName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {permissions.map((permission) => (
                        <div key={permission.id}>
                            {permission.assigned ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-green-600 text-white hover:cursor-pointer"
                                >
                                    <BadgeCheckIcon />
                                    {permission.name}
                                </Badge>
                            ) : (
                                <Badge
                                    key={permission.id}
                                    variant="outline"
                                    className="justify-start hover:cursor-pointer"
                                >
                                    {permission.name}
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
