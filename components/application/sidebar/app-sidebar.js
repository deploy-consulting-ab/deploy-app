import { Home, Percent, TrendingUp, ClipboardList, Calendar } from 'lucide-react';
import DeployLogo from '@/components/deploy-logo';
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
    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5 mt-2"
                        >
                            <Link href={DEFAULT_REDIRECT_ROUTE}>
                                <div className="flex aspect-square size-32 items-center justify-center">
                                    <DeployLogo className="h-10 w-auto z-[99] relative" />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
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
