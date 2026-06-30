'use client';

import { WeeklyTimecardComponent } from './weekly-timecard';
import { TimecardFilters } from './timecard-filters';
import { useReducer, useMemo, useEffect, useCallback, startTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import {
    formatLocalDateKey,
    parseToLocalDate,
    weekOverlapsLocalDateRange,
} from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

function timecardListReducer(state, action) {
    switch (action.type) {
        case 'SYNC_FROM_URL':
            return {
                startDate: action.startDate,
                endDate: action.endDate,
                currentPage: 1,
            };
        case 'SET_START_DATE':
            return { ...state, startDate: action.date, currentPage: 1 };
        case 'SET_END_DATE':
            return { ...state, endDate: action.date, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.page };
        default:
            return state;
    }
}

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
    const [{ startDate, endDate, currentPage }, dispatch] = useReducer(
        timecardListReducer,
        searchParams,
        (params) => ({
            startDate: parseToLocalDate(params.get('startDate')),
            endDate: parseToLocalDate(params.get('endDate')),
            currentPage: 1,
        })
    );

    useEffect(() => {
        dispatch({
            type: 'SYNC_FROM_URL',
            startDate: parseToLocalDate(searchParams.get('startDate')),
            endDate: parseToLocalDate(searchParams.get('endDate')),
        });
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
        dispatch({ type: 'SET_PAGE', page: newPage });
    };

    const handleStartDateChange = (date) => {
        dispatch({ type: 'SET_START_DATE', date });
        updateDateParams(date, endDate);
    };

    const handleEndDateChange = (date) => {
        dispatch({ type: 'SET_END_DATE', date });
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
