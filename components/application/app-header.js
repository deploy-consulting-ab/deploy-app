

import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumb } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/actions/logout';

export function AppHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" /> {/* Displays icon to close the sidebar*/}
            <div className="hidden md:block">
                <DynamicBreadcrumb />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={logout}>
                    <LogOut />
                </Button>
            </div>
        </header>
    );
}
