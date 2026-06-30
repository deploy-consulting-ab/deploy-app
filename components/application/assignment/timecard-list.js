'use client';

import { WeeklyTimecardComponent } from './weekly-timecard';
import { TimecardFilters } from './timecard-filters';
import { useState, useMemo, useEffect, useCallback, startTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import {
    formatLocalDateKey,
    parseToLocalDate,
    weekOverlapsLocalDateRange,
} from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

function filterTimecardsByDateRange(timecards, startDate, endDate) {
    if (!startDate && !endDate) return timecards;

    const startBound = startDate ? formatLocalDateKey(startDate) : null;
    const endBound = endDate ? formatLocalDateKey(endDate) : null;

    return timecards.filter((timecard) =>
        weekOverlapsLocalDateRange(timecard.weekStartDate, startBound, endBound)
    );
}

export function TimecardListComponent({ timecards = [], error }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(() => parseToLocalDate(searchParams.get('startDate')));
    const [endDate, setEndDate] = useState(() => parseToLocalDate(searchParams.get('endDate')));

    useEffect(() => {
        setStartDate(parseToLocalDate(searchParams.get('startDate')));
        setEndDate(parseToLocalDate(searchParams.get('endDate')));
        setCurrentPage(1);
    }, [searchParams]);

    const updateDateParams = useCallback(
        (nextStartDate, nextEndDate) => {
            const params = new URLSearchParams(searchParams.toString());

            if (nextStartDate) {
                params.set('startDate', formatLocalDateKey(nextStartDate));
            } else {
                params.delete('startDate');
            }

            if (nextEndDate) {
                params.set('endDate', formatLocalDateKey(nextEndDate));
            } else {
                params.delete('endDate');
            }

            const query = params.toString();
            startTransition(() => {
                router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
            });
        },
        [pathname, router, searchParams]
    );

    const filteredTimecards = useMemo(
        () => filterTimecardsByDateRange(timecards, startDate, endDate),
        [timecards, startDate, endDate]
    );

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const totalPages = Math.max(1, Math.ceil(filteredTimecards.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTimecards = filteredTimecards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setCurrentPage(1);
        updateDateParams(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setCurrentPage(1);
        updateDateParams(startDate, date);
    };

    const hasDateFilter = startDate || endDate;

    return (
        <div>
            <TimecardFilters
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onPageChange={handlePageChange}
                totalPages={totalPages}
                currentPage={currentPage}
            />

            <div className="space-y-4">
                {paginatedTimecards.map((weekData) => (
                    <WeeklyTimecardComponent
                        key={weekData.weekStartDate}
                        weekData={weekData}
                        filterStartDate={startDate}
                        filterEndDate={endDate}
                    />
                ))}
                {paginatedTimecards.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        {hasDateFilter
                            ? 'No time reports found for the selected date range.'
                            : 'No time reports available for this assignment.'}
                    </p>
                )}
            </div>
        </div>
    );
}
