'use server';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';

export async function SetupHeaderComponent() {
    return (
        <>
            <header className="dark:[background:var(--haberdashery-gradient)] flex h-16 shrink-0 items-center justify-between border-b dark:border-b-0 px-4">
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
