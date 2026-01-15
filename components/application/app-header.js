'use server';

import { auth } from '@/auth';
import { ImpersonationBannerComponent } from '@/components/application/impersonation/impersonation-banner';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';
import { GlobalSearch } from '@/components/application/search/global-search';
import { SetupButtonComponent } from '@/components/application/setup-button';
import { VIEW_SETUP_PERMISSION } from '@/lib/rba-constants';

export async function AppHeaderComponent() {
    const session = await auth();
    const { user } = session;

    return (
        <>
            <ImpersonationBannerComponent />
            <header className="dark:[background:var(--haberdashery-gradient)] flex h-16 shrink-0 items-center border-b dark:border-b-0 dark:[box-shadow:inset_0_-0.5px_0_rgba(200,210,220,0.15)] px-4">
                {/* Left section with sidebar trigger and breadcrumbs - no fixed width */}
                <div className="flex items-center gap-4 min-w-fit">
                    <SidebarTrigger className="-ml-1" />
                    <div className="hidden md:block whitespace-nowrap">
                        <DynamicBreadcrumbComponent />
                    </div>
                </div>
                {/* Center section with search */}
                <div className="flex-1 flex justify-center px-4">
                    <div className="w-full max-w-xl">
                        <GlobalSearch user={user} />
                    </div>
                </div>
                {/* Right section with icons */}
                <div className="flex items-center gap-2">
                    {user.systemPermissions.includes(VIEW_SETUP_PERMISSION) && (
                        <SetupButtonComponent />
                    )}
                    <ModeToggleComponent />
                    <LogoutButtonComponent />
                </div>
            </header>
            {/* Mobile breadcrumb */}
            <div className="md:hidden px-4 pt-4">
                <DynamicBreadcrumbComponent />
            </div>
        </>
    );
}
