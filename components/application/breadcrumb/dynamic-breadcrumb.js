'use client';

import { Fragment, useLayoutEffect, useRef, useState } from 'react';
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
const SEGMENT_SHIFT_PX = 10;
const MAX_SEGMENT_SHIFT_PX = 40;

const isRecordId = (segment) => SALESFORCE_ID_PATTERN.test(segment);

const formatBreadcrumbSegment = (segment, isLast = false) => {
    if (isRecordId(segment) && !isLast) {
        return `${segment.slice(0, 4)}...`;
    }

    if (isRecordId(segment)) {
        return segment;
    }

    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return label;
};

const getSegmentShiftPx = (segmentCount) =>
    Math.min(Math.max(0, segmentCount - 1) * SEGMENT_SHIFT_PX, MAX_SEGMENT_SHIFT_PX);

export function DynamicBreadcrumbComponent({ maxContainerWidth = null, onContentWidthChange }) {
    const pathname = usePathname();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const lastLabelRef = useRef(null);
    const [lastSegmentLimit, setLastSegmentLimit] = useState(null);

    const segments = pathname.split('/').filter(Boolean);
    const lastIndex = segments.length - 1;
    const lastSegment = segments[lastIndex];
    const fullLastLabel = lastSegment ? formatBreadcrumbSegment(lastSegment, true) : '';
    const segmentShiftPx = getSegmentShiftPx(segments.length);

    const lastDisplayLabel = fullLastLabel;

    useLayoutEffect(() => {
        const list = listRef.current;
        const lastLabel = lastLabelRef.current;

        if (!list || !lastLabel || !onContentWidthChange) {
            return undefined;
        }

        const reportContentWidth = () => {
            if (fullLastLabel) {
                lastLabel.textContent = fullLastLabel;
            }
            onContentWidthChange(list.scrollWidth + segmentShiftPx);
        };

        reportContentWidth();

        const resizeObserver = new ResizeObserver(reportContentWidth);
        resizeObserver.observe(list);
        return () => resizeObserver.disconnect();
    }, [pathname, fullLastLabel, segmentShiftPx, onContentWidthChange]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const list = listRef.current;
        const lastLabel = lastLabelRef.current;

        if (!container || !list || !lastLabel) {
            return undefined;
        }

        const fitBreadcrumb = () => {
            if (!fullLastLabel) {
                setLastSegmentLimit(null);
                container.scrollLeft = 0;
                return;
            }

            let limit = null;
            lastLabel.textContent = fullLastLabel;

            container.scrollLeft = container.scrollWidth;

            if (list.scrollWidth > container.clientWidth) {
                for (let chars = fullLastLabel.length - 1; chars >= 1; chars -= 1) {
                    lastLabel.textContent = fullLastLabel;
                    if (list.scrollWidth <= container.clientWidth) {
                        limit = chars;
                        break;
                    }
                }
                if (limit === null) {
                    limit = 1;
                }
            }

            const displayLabel = fullLastLabel;
            setLastSegmentLimit(limit);
            lastLabel.textContent = displayLabel;
            container.scrollLeft = container.scrollWidth;
        };

        fitBreadcrumb();

        const resizeObserver = new ResizeObserver(fitBreadcrumb);
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [pathname, fullLastLabel, segmentShiftPx, maxContainerWidth]);

    return (
        <div
            ref={containerRef}
            className="min-w-0 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
                paddingLeft: segmentShiftPx,
                maxWidth: maxContainerWidth != null ? `${maxContainerWidth}px` : undefined,
            }}
        >
            <div ref={listRef} className="w-max">
                <Breadcrumb>
                    <BreadcrumbList className="flex-nowrap">
                        {segments.map((segment, index) => {
                            const href = `/${segments.slice(0, index + 1).join('/')}`;
                            const isLast = index === segments.length - 1;
                            const displayText = isLast
                                ? lastDisplayLabel
                                : formatBreadcrumbSegment(segment, false);

                            return (
                                <Fragment key={href}>
                                    <BreadcrumbItem className="shrink-0">
                                        {isLast ? (
                                            <BreadcrumbPage title={segment}>
                                                <span ref={lastLabelRef}>{displayText}</span>
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={href} title={segment}>
                                                    {displayText}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="shrink-0" />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    );
}
