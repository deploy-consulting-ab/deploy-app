'use client';

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
    useSidebar,
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

export function AppSidebarComponent({ user }) {
    const { isMobile, setOpenMobile } = useSidebar();

    // Function to handle menu item clicks
    const handleMenuClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    // Menu items defined inside component to avoid shared state
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

    // Add admin item conditionally without mutating the array
    const menuItems = user.role === 'ADMIN' 
        ? [...items, {
            title: 'Admin',
            url: ADMIN_ROUTE,
            icon: Shield,
        }]
        : items;

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <AppSidebarLogoComponent />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tilde</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((menu) => (
                                <SidebarMenuItem key={menu.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={menu.url} onClick={handleMenuClick}>
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
