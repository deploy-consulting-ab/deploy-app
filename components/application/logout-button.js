'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/logout';

export function LogoutButtonComponent({ className }) {
    return (
        <Button variant="ghost" size="sm" className={className} onClick={logout}>
            <LogOut />
        </Button>
    );
}
