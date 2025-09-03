import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';
import { GlobalSearch } from '@/components/application/search/global-search';

export function AppHeaderComponent() {
    return (
        <header className="flex h-16 shrink-0 items-center border-b px-4">
            {/* Left section with sidebar trigger and breadcrumbs - no fixed width */}
            <div className="flex items-center gap-4 min-w-fit">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden md:block whitespace-nowrap">
                    <DynamicBreadcrumbComponent />
                </div>
            </div>
            {/* Center/Right section with search and icons */}
            <div className="flex flex-1 items-center justify-end gap-4 pl-8">
                <div className="flex-1 max-w-xl">
                    <GlobalSearch />
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggleComponent />
                    <LogoutButtonComponent />
                </div>
            </div>
        </header>
    );
}
