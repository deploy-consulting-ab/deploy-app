import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';
import { GlobalSearch } from '@/components/application/search/global-search';

export function AppHeaderComponent() {
    return (
        <header className="flex h-16 shrink-0 items-center border-b px-4">
            <div className="flex items-center gap-4 w-1/4">
                <SidebarTrigger className="-ml-1" /> {/* Displays icon to close the sidebar*/}
                <div className="hidden md:block">
                    <DynamicBreadcrumbComponent />
                </div>
            </div>
            <div className="flex-1 flex justify-center max-w-2xl mx-auto px-4">
                <GlobalSearch />
            </div>
            <div className="flex items-center gap-4 justify-end w-1/4">
                <ModeToggleComponent />
                <LogoutButtonComponent />
            </div>
        </header>
    );
}
