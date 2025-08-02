import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/application/sidebar/app-sidebar';
import { auth } from '@/auth';

export default async function Layout({ children }) {

    const session = await auth();
    const { user } = session;
    console.log('Layout', user);
    

    return (
        <SidebarProvider>
            <AppSidebar user={user}/>
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
