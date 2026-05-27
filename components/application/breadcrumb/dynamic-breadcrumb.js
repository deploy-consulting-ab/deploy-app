'use client';

import { Fragment } from 'react';
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

const truncateText = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

const formatBreadcrumbSegment = (segment) => {
    if (isRecordId(segment)) {
        return `${segment.slice(0, 4)}...`;
    }

    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return truncateText(label);
};

export function DynamicBreadcrumbComponent() {
    const pathname = usePathname();

    // Remove the leading slash and split the path
    const segments = pathname.split('/').filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join('/')}`;
                    const isLast = index === segments.length - 1;

                    const displayText = formatBreadcrumbSegment(segment);

                    return (
                        <Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage title={segment}>{displayText}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{displayText}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
