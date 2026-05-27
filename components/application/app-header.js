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

export async function AppHeaderComponent({ location }) {
    const session = await auth();
    const { user } = session;

    const isHomePage = location === 'home';
    return (
        <>
            <ImpersonationBannerComponent />
            <header className="bg-sidebar grid h-16 w-full max-w-full shrink-0 grid-cols-[minmax(0,1fr)_minmax(12rem,36rem)_auto] items-center gap-x-4 overflow-hidden px-4 sticky top-0 z-40">
                <div className="flex min-w-0 items-center gap-4 overflow-hidden">
                    <SidebarTrigger className="-ml-1 shrink-0 hover:bg-accent/50 rounded-lg transition-colors" />
                    <div className="hidden min-w-0 flex-1 md:block">
                        <DynamicBreadcrumbComponent />
                    </div>
                </div>

                <div className="flex min-w-0 justify-center px-4">
                    <div className="w-full max-w-xl">
                        <GlobalSearch user={user} location={location} />
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-self-end gap-2">
                    {user.systemPermissions.includes(VIEW_SETUP_PERMISSION) && isHomePage && (
                        <SetupButtonComponent />
                    )}
                    <ModeToggleComponent />
                    <LogoutButtonComponent />
                </div>
            </header>
        </>
    );
}
