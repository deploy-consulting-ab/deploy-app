'use client';

import Link from 'next/link';
import DeployLogo from '@/components/deploy-logo';
import DeployIconLogo from '@/components/deploy-icon-logo';
import {
    useSidebar,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';

import { HOME_ROUTE } from '@/menus/routes';

export function AppSidebarLogoComponent() {
    const { state } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 mt-2">
                    <Link href={HOME_ROUTE}>
                        {state === 'collapsed' ? (
                            <div className="flex aspect-square size-25 items-center justify-center">
                                <DeployIconLogo className="h-10 w-auto z-[99] relative" />
                            </div>
                        ) : (
                            <div className="flex aspect-square size-36 items-center justify-center">
                                <DeployLogo className="h-10 w-auto z-[99] relative" />
                            </div>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
