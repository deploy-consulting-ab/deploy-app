import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/application/sidebar/app-sidebar';
import { auth } from '@/auth';
import { DynamicBreadcrumb } from '@/components/application/breadcrumb/dynamic-breadcrumb';

export default async function Layout({ children }) {
    const session = await auth();
    const { user } = session;
    console.log('Layout', user);

    return (
        <SidebarProvider
            style={{
                '--sidebar-width': '14rem',
                '--sidebar-width-mobile': '14rem',
            }}
        >
            <AppSidebar user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" /> {/* Displays icon to close the sidebar*/}
                    <div className="hidden md:block">
                        <DynamicBreadcrumb />
                    </div>
                </header>
                <main>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
