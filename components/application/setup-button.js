'use client';

import Link from 'next/link';
import { SETUP_ROUTE } from '@/menus/routes';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function SetupButtonComponent() {
    const isMobile = useIsMobile();

    if (isMobile) {
        return null;
    }

    return (
            <Link href={SETUP_ROUTE} className="hover:cursor-pointer">
            <Button variant="outline" size="icon">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        </Link>
    );
}