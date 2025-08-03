import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import DeployLogo from '@/images/deploy-logo.png';
import Image from 'next/image';
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
} from '@/components/ui/sidebar';
import { AppSidebarUser } from '@/components/application/sidebar/app-sidebar-user';

// Menu items.
const items = [
    {
        title: 'Home',
        url: '/settings/home',
        icon: Home,
    },
    {
        title: 'Inbox',
        url: '/settings/inbox',
        icon: Inbox,
    },
    {
        title: 'Calendar',
        url: '#',
        icon: Calendar,
    },
    {
        title: 'Search',
        url: '#',
        icon: Search,
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings,
    },
];

export function AppSidebar({ user }) {
    return (
        <Sidebar variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5 mt-2"
                        >

                            <Link href="/settings">
                                <div className="flex aspect-square size-32 items-center justify-center">
                                    <Image
                                        src={DeployLogo}
                                        width={200}
                                        height={200}
                                        alt="deploy-logo"
                                    />
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
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AppSidebarUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
