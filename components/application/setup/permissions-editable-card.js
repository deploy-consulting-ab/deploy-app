import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PermissionsEditableCardComponent({
    entityName,
    entityPermissions,
    totalPermissions,
}) {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Permissions for {entityName}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Assigned Permissions</p>
                <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {entityPermissions.map((permission) => (
                        <Badge key={permission.id} variant="secondary" className="justify-start">
                            {permission.name}
                        </Badge>
                    ))}
                </div>
                <p>Available Permissions</p>
                <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {totalPermissions.map((permission) => (
                        <Badge key={permission.id} variant="secondary" className="justify-start">
                            {permission.name}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
