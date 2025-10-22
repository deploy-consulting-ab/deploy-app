import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeCheckIcon } from 'lucide-react';
import { populateSystemPermissions } from '@/lib/utils';
import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { useEffect, useState, useRef } from 'react';

export function SystemPermissionsEditableCardComponent({
    entityName,
    currentSystemPermissions,
    totalSystemPermissions,
    onSystemPermissionClick,
    error,
    success,
}) {
    const systemPermissions = currentSystemPermissions
        ? populateSystemPermissions(currentSystemPermissions, totalSystemPermissions)
        : totalSystemPermissions;

    const [isScrollable, setIsScrollable] = useState(false);
    const contentRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const checkScrollable = () => {
            if (contentRef.current) {
                const { scrollHeight, clientHeight } = contentRef.current;
                setIsScrollable(scrollHeight > clientHeight);
            }
        };

        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, [systemPermissions]);

    useEffect(() => {
        let fadeOutTimer;

        if (success) {
            setIsVisible(true);

            // Start fade out after 1 second
            fadeOutTimer = setTimeout(() => {
                setIsVisible(false);
            }, 1000);
        }

        return () => {
            clearTimeout(fadeOutTimer);
        };
    }, [success]);

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Permissions for {entityName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div
                        ref={contentRef}
                        className="flex flex-wrap gap-x-2 gap-y-2 max-h-[200px] overflow-y-auto pr-2"
                    >
                        {systemPermissions.map((systemPermission) => (
                            <div key={systemPermission.id}>
                                {systemPermission.assigned ? (
                                    <Badge
                                        variant="primary"
                                        className="bg-green-700 text-white hover:cursor-pointer text-sm"
                                        onClick={() =>
                                            onSystemPermissionClick?.(
                                                systemPermission.id,
                                                systemPermission.assigned
                                            )
                                        }
                                    >
                                        <BadgeCheckIcon />
                                        {systemPermission.name}
                                    </Badge>
                                ) : (
                                    <Badge
                                        key={systemPermission.id}
                                        variant="outline"
                                        className="justify-start hover:cursor-pointer text-sm"
                                        onClick={() =>
                                            onSystemPermissionClick?.(
                                                systemPermission.id,
                                                systemPermission.assigned
                                            )
                                        }
                                    >
                                        {systemPermission.name}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                    {isScrollable && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none dark:from-zinc-900/95" />
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <FormError message={error} />
                <div
                    className={`transition-opacity duration-500 ease-in-out ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <FormSuccess message={success} />
                </div>
            </CardFooter>
        </Card>
    );
}
