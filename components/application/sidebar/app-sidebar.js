'use server';

import { AppSidebarLogoComponent } from '@/components/application/sidebar/app-sidebar-logo';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarFooter,
    SidebarRail,
} from '@/components/ui/sidebar';
import { AppSidebarUserComponent } from '@/components/application/sidebar/app-sidebar-user';
import { AppSidebarMenusComponent } from '@/components/application/sidebar/app-sidebar-menus';

export async function AppSidebarComponent({ user, location }) {
    return (
        <Sidebar
            variant="default"
            collapsible="icon"
            className="dark:[background:var(--haberdashery-gradient)] dark:border-r-0 dark:[box-shadow:inset_-0.5px_0_0_rgba(200,210,220,0.15)]"
        >
            <SidebarHeader>
                <AppSidebarLogoComponent />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tilde</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <AppSidebarMenusComponent user={user} location={location} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AppSidebarUserComponent user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
