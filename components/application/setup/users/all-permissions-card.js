import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


export function AllPermissionsCardComponent({ user }) {
    return (
    <Card className="col-span-1">
        <CardHeader>
            <CardTitle>All Permissions</CardTitle>
            <CardDescription>
                Combined permissions from Profile and Permission Sets
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[200px] overflow-y-auto pr-2">
                {Array.from(user.allPermissions).map((permission) => (
                    <Badge
                        key={permission}
                        variant="secondary"
                        className="justify-start"
                    >
                        {permission}
                    </Badge>
                ))}
            </div>
        </CardContent>
    </Card>
    );
}