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
            <div className="grid grid-cols-1 gap-1">
                {Array.from(user.allPermissions).map((permission) => (
                    <Badge
                        key={permission}
                        variant="secondary"
                        className="justify-start my-1"
                    >
                        {permission}
                    </Badge>
                ))}
            </div>
        </CardContent>
    </Card>
    );
}