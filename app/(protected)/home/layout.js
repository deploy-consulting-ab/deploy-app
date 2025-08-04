import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/application/sidebar/app-sidebar';
import { auth } from '@/auth';
import { AppHeader } from '@/components/application/app-header';

export default async function Layout({ children }) {
    const session = await auth();
    const { user } = session;
    return (
        <SidebarProvider
            style={{
                '--sidebar-width': '14rem',
                '--sidebar-width-mobile': '14rem',
            }}
        >
            <AppSidebar user={user} />
            <SidebarInset>
                <AppHeader />
                <main>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
