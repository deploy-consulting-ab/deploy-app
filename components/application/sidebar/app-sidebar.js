
import { Home, Percent, TrendingUp, ClipboardList, Calendar, Shield } from 'lucide-react';
import { AppSidebarLogoComponent } from '@/components/application/sidebar/app-sidebar-logo';
import Link from 'next/link';

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarRail,
} from '@/components/ui/sidebar';
import { AppSidebarUserComponent } from '@/components/application/sidebar/app-sidebar-user';

import {
    DEFAULT_REDIRECT_ROUTE,
    OCCUPANCY_ROUTE,
    HOLIDAYS_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    ADMIN_ROUTE,
} from '@/routes';

// Menu items.
const items = [
    {
        title: 'Home',
        url: DEFAULT_REDIRECT_ROUTE,
        icon: Home,
    },
    {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
    },
    {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
    },
    {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
    },
    {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
    },
];
export function AppSidebarComponent({ user }) {


    if (user.role === 'ADMIN') {
        items.push({
            title: 'Admin',
            url: ADMIN_ROUTE,
            icon: Shield,
        });
    }

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <AppSidebarLogoComponent />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((menu) => (
                                <SidebarMenuItem key={menu.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={menu.url}>
                                            <menu.icon />
                                            <span>{menu.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
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
