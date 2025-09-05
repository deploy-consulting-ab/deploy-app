'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const BackButtonComponent = ({ label, href }) => {
    return (
        <Button
            variant="link"
            className="w-full font-normal text-black dark:text-black"
            size="sm"
            asChild
        >
            <Link href={href}>{label}</Link>
        </Button>
    );
};
