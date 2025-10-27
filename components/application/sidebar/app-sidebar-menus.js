'use client';

import { SETUP_ROUTE, HOME_ROUTE } from '@/menus/routes';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { getMenuForLocation } from '@/menus/menu-builder';
import { cn } from '@/lib/utils';

export function AppSidebarMenusComponent({ user, location }) {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathname = usePathname();

    const sidebarMenuItems = getMenuForLocation(
        location,
        user?.profileId,
        new Set(user?.systemPermissions)
    );

    // Function to handle menu item clicks
    const handleMenuClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    // Function to check if a menu item is active
    const isMenuActive = (menuUrl) => {
        // For setup and home page, only match exact /setup or /home path
        if (menuUrl === SETUP_ROUTE) {
            return pathname === SETUP_ROUTE;
        } else if (menuUrl === HOME_ROUTE) {
            return pathname === HOME_ROUTE;
        }
        // For other pages, check if the pathname starts with the menu URL
        // This ensures that sub-pages also highlight their parent menu item
        return pathname.startsWith(menuUrl);
    };

    return (
        <SidebarMenu>
            {sidebarMenuItems.map((menu) => (
                <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton
                        variant="default"
                        asChild
                        isActive={isMenuActive(menu.url)}
                        className={cn(
                            'hover:bg-accent/50',
                            isMenuActive(menu.url) && 'dark:!bg-accent/50'
                        )}
                    >
                        <Link href={menu.url} onClick={handleMenuClick}>
                            <menu.icon />
                            <span>{menu.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
