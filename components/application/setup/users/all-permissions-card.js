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
                <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {Array.from(user.allPermissions).map((permission) => (
                        <Badge
                            key={permission}
                            variant="primary"
                            className="justify-start bg-green-700 text-white text-sm"
                        >
                            {permission}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
