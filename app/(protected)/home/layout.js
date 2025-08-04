import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarComponent } from '@/components/application/sidebar/app-sidebar';
import { auth } from '@/auth';
import { AppHeaderComponent } from '@/components/application/app-header';

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
            <AppSidebarComponent user={user} />
            <SidebarInset>
                <AppHeaderComponent />
                <main>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
