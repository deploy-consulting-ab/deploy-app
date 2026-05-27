'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbComponent } from '@/components/application/breadcrumb/dynamic-breadcrumb';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { LogoutButtonComponent } from '@/components/application/logout-button';
import { GlobalSearch } from '@/components/application/search/global-search';
import { SetupButtonComponent } from '@/components/application/setup-button';
import { cn } from '@/lib/utils';

const SEARCH_WIDTH_PX = 400;
const TRIGGER_WIDTH_PX = 32;
const HEADER_GAP_PX = 16;

export function AppHeaderBar({ user, location, showSetup }) {
    const headerRef = useRef(null);
    const iconsRef = useRef(null);
    const breadcrumbWidthRef = useRef(0);
    const [searchOnRight, setSearchOnRight] = useState(false);
    const [centeredBreadcrumbMaxWidth, setCenteredBreadcrumbMaxWidth] = useState(null);
    const [expandedBreadcrumbMaxWidth, setExpandedBreadcrumbMaxWidth] = useState(null);

    const updateSearchPlacement = useCallback(() => {
        const header = headerRef.current;
        if (!header) return;

        const isBreadcrumbVisible = window.matchMedia('(min-width: 768px)').matches;
        if (!isBreadcrumbVisible) {
            setSearchOnRight(false);
            return;
        }

        const headerWidth = header.clientWidth;
        const iconsWidth = iconsRef.current?.offsetWidth ?? 0;
        const centeredBudget = Math.max(
            0,
            headerWidth / 2 -
                SEARCH_WIDTH_PX / 2 -
                TRIGGER_WIDTH_PX -
                HEADER_GAP_PX * 3
        );
        const expandedBudget = Math.max(
            0,
            headerWidth -
                SEARCH_WIDTH_PX -
                iconsWidth -
                TRIGGER_WIDTH_PX -
                HEADER_GAP_PX * 4
        );

        setCenteredBreadcrumbMaxWidth(centeredBudget);
        setExpandedBreadcrumbMaxWidth(expandedBudget);
        setSearchOnRight(breadcrumbWidthRef.current > centeredBudget);
    }, []);

    const handleBreadcrumbWidthChange = useCallback(
        (width) => {
            breadcrumbWidthRef.current = width;
            updateSearchPlacement();
        },
        [updateSearchPlacement]
    );

    useLayoutEffect(() => {
        const header = headerRef.current;
        if (!header) return undefined;

        updateSearchPlacement();

        const resizeObserver = new ResizeObserver(updateSearchPlacement);
        resizeObserver.observe(header);
        if (iconsRef.current) {
            resizeObserver.observe(iconsRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [updateSearchPlacement, showSetup]);

    const search = (
        <div style={{ width: SEARCH_WIDTH_PX }}>
            <GlobalSearch user={user} location={location} />
        </div>
    );

    return (
        <header
            ref={headerRef}
            className={cn(
                'bg-sidebar sticky top-0 z-50 flex h-16 w-full max-w-full shrink-0 items-center px-4',
                searchOnRight ? 'gap-4' : 'relative gap-4'
            )}
        >
            <div className="flex min-w-0 shrink items-center gap-4 overflow-hidden">
                <SidebarTrigger className="-ml-1 shrink-0 hover:bg-accent/50 rounded-lg transition-colors" />
                <div className="hidden min-w-0 overflow-hidden md:block">
                    <DynamicBreadcrumbComponent
                        maxContainerWidth={
                            searchOnRight
                                ? expandedBreadcrumbMaxWidth
                                : centeredBreadcrumbMaxWidth
                        }
                        onContentWidthChange={handleBreadcrumbWidthChange}
                    />
                </div>
            </div>

            {searchOnRight ? (
                <>
                    <div className="relative z-20 shrink-0">{search}</div>
                    <div className="min-w-0 flex-1" aria-hidden="true" />
                </>
            ) : (
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="pointer-events-auto">{search}</div>
                </div>
            )}

            <div
                ref={iconsRef}
                className={cn(
                    'relative z-10 flex shrink-0 items-center gap-2',
                    !searchOnRight && 'ml-auto'
                )}
            >
                {showSetup && <SetupButtonComponent />}
                <ModeToggleComponent />
                <LogoutButtonComponent />
            </div>
        </header>
    );
}
