'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const SALESFORCE_ID_PATTERN = /^[a-zA-Z0-9]{15}([a-zA-Z0-9]{3})?$/;

const isRecordId = (segment) => SALESFORCE_ID_PATTERN.test(segment);

const formatBreadcrumbSegment = (segment) => {
    if (isRecordId(segment)) {
        return `${segment.slice(0, 5)}...`;
    }

    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return label;
};

export function DynamicBreadcrumbComponent() {
    const pathname = usePathname();
    const scrollRef = useRef(null);

    const segments = pathname.split('/').filter(Boolean);

    useLayoutEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.scrollLeft = container.scrollWidth;
    }, [pathname]);

    return (
        <div
            ref={scrollRef}
            className="min-w-0 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            <div className="w-max">
                <Breadcrumb>
                    <BreadcrumbList className="flex-nowrap">
                        {segments.map((segment, index) => {
                            const href = `/${segments.slice(0, index + 1).join('/')}`;
                            const isLast = index === segments.length - 1;
                            const displayText = formatBreadcrumbSegment(segment);

                            return (
                                <Fragment key={href}>
                                    <BreadcrumbItem className="shrink-0">
                                        {isLast ? (
                                            <BreadcrumbPage title={segment}>
                                                {displayText}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={href} title={segment}>
                                                    {displayText}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && (
                                        <BreadcrumbSeparator className="shrink-0" />
                                    )}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    );
}
