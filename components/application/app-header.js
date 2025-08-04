
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumb } from '@/components/application/breadcrumb/dynamic-breadcrumb';

export function AppHeader() {
    return (


                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" /> {/* Displays icon to close the sidebar*/}
                    <div className="hidden md:block">
                        <DynamicBreadcrumb />
                    </div>
                </header>

        
    );
}