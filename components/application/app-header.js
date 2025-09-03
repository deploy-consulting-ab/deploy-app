import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';
import { GlobalSearch } from '@/components/application/search/global-search';

export function AppHeaderComponent() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
            <SidebarTrigger className="-ml-1" /> {/* Displays icon to close the sidebar*/}
            <div className="hidden md:block">
                <DynamicBreadcrumbComponent />
            </div>
            <div className="flex-1 max-w-xl">
                <GlobalSearch />
            </div>
            <div className="flex items-center gap-2">
                <ModeToggleComponent />
                <LogoutButtonComponent />
            </div>
        </header>
    );
}
