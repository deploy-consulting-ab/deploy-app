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
import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { useMemo } from 'react';
import { useScrollableOverflow } from '@/hooks/use-scrollable-overflow';
import { useSuccessVisibility } from '@/hooks/use-success-visibility';

/**
 * Editable card for toggling field permissions on a profile or permission set.
 * Permissions are grouped by system + objectName for clarity.
 *
 * @param {Object} props
 * @param {string} props.entityName - Display name (e.g. "Profile", "Permission Set")
 * @param {Array} props.totalFieldPermissions - All field permissions, each with an `assigned` boolean
 * @param {Function} props.onFieldPermissionClick - Called with (id, isAssigned)
 * @param {string} props.error
 * @param {string} props.success
 */
export function FieldPermissionsEditableCardComponent({
    entityName,
    totalFieldPermissions,
    onFieldPermissionClick,
    error,
    success,
}) {
    const { contentRef, isScrollable } = useScrollableOverflow();
    const isVisible = useSuccessVisibility(success);

    // Group by "system / objectName"
    const groups = useMemo(() => {
        const map = new Map();
        for (const fp of totalFieldPermissions) {
            const key = `${fp.system} / ${fp.objectName}`;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(fp);
        }
        return Array.from(map.entries()).map(([groupKey, items]) => ({
            groupKey,
            items: items.toSorted((a, b) => (b.assigned ? 1 : -1)),
        }));
    }, [totalFieldPermissions]);

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Field Permissions</CardTitle>
                <CardDescription>Field-level access for {entityName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div
                        ref={contentRef}
                        className="flex flex-col gap-y-4 max-h-[300px] overflow-y-auto pr-2"
                    >
                        {groups.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No field permissions defined yet.
                            </p>
                        )}
                        {groups.map(({ groupKey, items }) => (
                            <div key={groupKey} className="space-y-1.5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {groupKey}
                                </p>
                                <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                                    {items.map((fp) =>
                                        fp.assigned ? (
                                            <Badge
                                                key={fp.id}
                                                variant="primary"
                                                className="bg-green-700 text-white hover:cursor-pointer text-sm"
                                                onClick={() =>
                                                    onFieldPermissionClick?.(fp.id, fp.assigned)
                                                }
                                            >
                                                <BadgeCheckIcon />
                                                {fp.label || fp.fieldName}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                key={fp.id}
                                                variant="outline"
                                                className="justify-start hover:cursor-pointer text-sm"
                                                onClick={() =>
                                                    onFieldPermissionClick?.(fp.id, fp.assigned)
                                                }
                                            >
                                                {fp.label || fp.fieldName}
                                            </Badge>
                                        )
                                    )}
                                </div>
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
