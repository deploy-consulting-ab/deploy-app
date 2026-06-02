'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OCCUPANCY_ROUTE } from '@/menus/routes';
import { cn } from '@/lib/utils';

const REDIRECT_ONLY_PATHS = new Set([OCCUPANCY_ROUTE]);

function getFallbackPath(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return null;

    let path = `/${segments.slice(0, -1).join('/')}`;
    while (REDIRECT_ONLY_PATHS.has(path)) {
        const parentSegments = path.split('/').filter(Boolean).slice(0, -1);
        if (parentSegments.length === 0) return null;
        path = `/${parentSegments.join('/')}`;
    }

    return path;
}

export function MobileBackButtonComponent({ className }) {
    const pathname = usePathname();
    const router = useRouter();
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length <= 1) return null;

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
            return;
        }

        const fallback = getFallbackPath(pathname);
        if (fallback) {
            router.push(fallback);
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                '-ml-1 size-7 shrink-0 rounded-lg border-0 hover:bg-accent/50 hover:cursor-pointer focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                className
            )}
            onClick={handleBack}
        >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
        </Button>
    );
}
