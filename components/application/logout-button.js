'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/logout';
import { useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';

export function LogoutButtonComponent() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logout();
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="hover:cursor-pointer"
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending ? <Spinner size="sm" variant="default" /> : <LogOut />}
        </Button>
    );
}
