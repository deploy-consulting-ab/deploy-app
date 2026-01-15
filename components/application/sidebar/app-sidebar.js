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
            className="border-r border-border/50 bg-background/95 backdrop-blur-xl"
        >
            <SidebarHeader className="border-b border-border/50 pb-4">
                <AppSidebarLogoComponent />
            </SidebarHeader>
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tilde
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <AppSidebarMenusComponent user={user} location={location} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-border/50 pt-4">
                <AppSidebarUserComponent user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
