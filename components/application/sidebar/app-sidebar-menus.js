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
        <SidebarMenu className="space-y-1">
            {sidebarMenuItems.map((menu) => (
                <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton
                        variant="default"
                        asChild
                        isActive={isMenuActive(menu.url)}
                        className={cn(
                            'rounded-xl hover:bg-accent/50 transition-all group',
                            isMenuActive(menu.url) &&
                                'bg-[var(--deploy-accent-silver)]/10 border-l-2 border-[var(--deploy-accent-silver)] font-semibold'
                        )}
                    >
                        <Link href={menu.url} onClick={handleMenuClick}>
                            <menu.icon
                                className={cn(
                                    'transition-colors',
                                    isMenuActive(menu.url) && 'text-[var(--deploy-accent-silver)]'
                                )}
                            />
                            <span>{menu.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
