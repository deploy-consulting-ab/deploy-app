import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeCheckIcon } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export function AllPermissionsCardComponent({ user }) {
    const [isScrollable, setIsScrollable] = useState(false);
    const contentRef = useRef(null);
    useEffect(() => {
        const checkScrollable = () => {
            if (contentRef.current) {
                const { scrollHeight, clientHeight } = contentRef.current;
                setIsScrollable(scrollHeight > clientHeight);
            }
        };

        checkScrollable();
        // Re-check when permissions change or window resizes
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, [user.allPermissions]);
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>All Permissions</CardTitle>
                <CardDescription>
                    Combined permissions from Profile and Permission Sets
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div
                        ref={contentRef}
                        className="flex flex-wrap gap-x-2 gap-y-2 max-h-[200px] overflow-y-auto pr-2"
                    >
                        {Array.from(user.allPermissions).map((permission) => (
                            <Badge
                                key={permission}
                                variant="primary"
                                className="justify-start bg-green-700 text-white text-sm"
                            >
                                <BadgeCheckIcon />
                                {permission}
                            </Badge>
                        ))}
                    </div>
                    {isScrollable && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none dark:from-zinc-900/95" />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
