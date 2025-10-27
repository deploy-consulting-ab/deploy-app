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
import { getSetupMenuForProfile } from '@/menus/menu-builder';
import { SETUP_ROUTE } from '@/menus/routes';
import { useTheme } from 'next-themes';

export function SetupSidebarComponent({ user }) {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathname = usePathname();
    const { theme } = useTheme();
    const systemPermissionsSet = new Set(user?.systemPermissions);
    const menuItems = getSetupMenuForProfile(user?.profileId, systemPermissionsSet);

    // Function to handle menu item clicks
    const handleMenuClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    // Function to check if a menu item is active
    const isMenuActive = (menuUrl) => {
        // For setup page, only match exact /setup path
        if (menuUrl === SETUP_ROUTE) {
            return pathname === SETUP_ROUTE;
        }
        // For other pages, check if the pathname starts with the menu URL
        // This ensures that sub-pages also highlight their parent menu item
        return pathname.startsWith(menuUrl);
    };

    const sidebarVariant = theme === 'dark' ? 'borderless' : 'default';

    return (
        <Sidebar
            variant={sidebarVariant}
            collapsible="icon"
            className="dark:[background:var(--haberdashery-gradient)]"
        >
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
