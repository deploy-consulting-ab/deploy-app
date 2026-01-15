import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarComponent } from '@/components/application/sidebar/app-sidebar';
import { auth } from '@/auth';
import { AppHeaderComponent } from '@/components/application/app-header';

export default async function HomeLayout({ children }) {
    const session = await auth();
    const { user } = session;
    return (
        <SidebarProvider
            style={{
                '--sidebar-width': '14rem',
                '--sidebar-width-mobile': '14rem',
            }}
        >
            <AppSidebarComponent user={user} location="home" />
            <SidebarInset>
                <AppHeaderComponent />
                <main className="h-full p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
