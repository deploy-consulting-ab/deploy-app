'use client';

import { SETUP_ROUTE, HOME_ROUTE } from '@/menus/routes';
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
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

    // Function to check if a submenu item is active
    const isSubMenuActive = (subMenuUrl) => {
        return pathname === subMenuUrl;
    };

    // Check if any submenu item is active (for keeping parent expanded)
    const hasActiveSubItem = (menu) => {
        if (!menu.items) return false;
        return menu.items.some((item) => pathname.startsWith(item.url));
    };

    return (
        <SidebarMenu className="space-y-1">
            {sidebarMenuItems.map((menu) => {
                // Render menu with subitems as collapsible
                if (menu.items && menu.items.length > 0) {
                    return (
                        <Collapsible
                            key={menu.title}
                            asChild
                            defaultOpen={hasActiveSubItem(menu)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        variant="default"
                                        isActive={isMenuActive(menu.url)}
                                        className={cn(
                                            'rounded-xl hover:bg-accent/50 transition-all group',
                                            isMenuActive(menu.url) &&
                                                'bg-[var(--deploy-accent-silver)]/10 border-l-2 border-[var(--deploy-accent-silver)] font-semibold'
                                        )}
                                    >
                                        <menu.icon
                                            className={cn(
                                                'transition-colors',
                                                isMenuActive(menu.url) &&
                                                    'text-[var(--deploy-accent-silver)]'
                                            )}
                                        />
                                        <span>{menu.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {menu.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isSubMenuActive(subItem.url)}
                                                    className={cn(
                                                        'rounded-lg hover:bg-accent/50 transition-all',
                                                        isSubMenuActive(subItem.url) &&
                                                            'bg-[var(--deploy-accent-silver)]/10 font-semibold'
                                                    )}
                                                >
                                                    <Link
                                                        href={subItem.url}
                                                        onClick={handleMenuClick}
                                                    >
                                                        {subItem.icon && (
                                                            <subItem.icon
                                                                className={cn(
                                                                    'size-4 transition-colors',
                                                                    isSubMenuActive(subItem.url) &&
                                                                        'text-[var(--deploy-accent-silver)]'
                                                                )}
                                                            />
                                                        )}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                // Render regular menu item without subitems
                return (
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
                                        isMenuActive(menu.url) &&
                                            'text-[var(--deploy-accent-silver)]'
                                    )}
                                />
                                <span>{menu.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
