import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { SetupSidebarComponent } from '@/components/application/setup/setup-sidebar';
import { auth } from '@/auth';
import { SetupHeaderComponent } from '@/components/application/setup/setup-header';

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
            <SetupSidebarComponent user={user} />
            <SidebarInset>
                <SetupHeaderComponent />
                <main>
                    <div className="px-4 md:px-8 md:py-2 max-w-full">{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
