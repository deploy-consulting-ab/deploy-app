'use server';

import { auth } from '@/auth';import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';

export async function SetupHeaderComponent() {
    const session = await auth();
    const { user } = session;

    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                {/* Left section with sidebar trigger and breadcrumbs - no fixed width */}
                <div className="flex items-center gap-4 min-w-fit">
                    <SidebarTrigger className="-ml-1" />
                    <div className="hidden md:block whitespace-nowrap">
                        <DynamicBreadcrumbComponent />
                    </div>
                </div>
                {/* Right section with icons */}
                <div className="flex items-center gap-2">
                    <ModeToggleComponent />
                    <LogoutButtonComponent />
                </div>
            </header>
        </>
    );
}
