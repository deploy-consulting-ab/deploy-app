import { Home, Inbox, TrendingUp, ClipboardList } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { AppSidebarUserComponent } from '@/components/application/sidebar/app-sidebar-user';

import { DEFAULT_REDIRECT_ROUTE } from '@/routes';

// Menu items.
const items = [
    {
        title: 'Home',
        url: DEFAULT_REDIRECT_ROUTE,
        icon: Home,
    },
    {
        title: 'Inbox',
        url: `${DEFAULT_REDIRECT_ROUTE}/inbox`,
        icon: Inbox,
    },
    {
        title: 'Assignments',
        url: `${DEFAULT_REDIRECT_ROUTE}/assignments`,
        icon: ClipboardList,
    },
    {
        title: 'Opportunities',
        url: `${DEFAULT_REDIRECT_ROUTE}/opportunities`,
        icon: TrendingUp,
    },
];

export function AppSidebarComponent({ user }) {
    return (
        <Sidebar variant="sidebar">
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
                <AppSidebarUserComponent user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
