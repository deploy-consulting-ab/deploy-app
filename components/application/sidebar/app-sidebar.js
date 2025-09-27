'use client';
import { AppSidebarLogoComponent } from '@/components/application/sidebar/app-sidebar-logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { getMenuForRole } from '@/menus/menu-builder';


export function AppSidebarComponent({ user }) {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathname = usePathname();

    const permissionsSet = new Set(user?.permissions);
    
    const menuItems = getMenuForRole(user?.role, permissionsSet);

    // Function to handle menu item clicks
    const handleMenuClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    // Function to check if a menu item is active
    const isMenuActive = (menuUrl) => {
        // For home page, only match exact /home path
        if (menuUrl === '/home') {
            return pathname === '/home';
        }
        // For other pages, check if the pathname starts with the menu URL
        // This ensures that sub-pages also highlight their parent menu item
        return pathname.startsWith(menuUrl);
    };

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
                                    <SidebarMenuButton asChild isActive={isMenuActive(menu.url)}>
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
