import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/application/sidebar/app-sidebar';
import { auth } from '@/auth';

export default async function Layout({ children }) {

    const session = await auth();
    const { user } = session;
    console.log('Layout', user);
    

    return (
        <SidebarProvider style={{
    "--sidebar-width": "14rem",
    "--sidebar-width-mobile": "14rem",
  }}>
            <AppSidebar user={user}/>
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
