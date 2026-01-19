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
            <AppSidebarComponent user={user} location="setup" />
            <SidebarInset className="bg-sidebar">
                <AppHeaderComponent location="setup" />
                <main className="flex-1 bg-background rounded-tl-3xl px-4 md:px-8 py-4 md:py-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
