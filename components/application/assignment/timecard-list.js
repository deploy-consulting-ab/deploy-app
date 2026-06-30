'use client';

import { WeeklyTimecardComponent } from './weekly-timecard';
import { TimecardFilters } from './timecard-filters';
import { useState, useMemo } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { formatLocalDateKey, getLocalWeekMonday, getLocalWeekSunday } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

function filterTimecardsByDateRange(timecards, startDate, endDate) {
    if (!startDate && !endDate) return timecards;

    const startBound = startDate
        ? formatLocalDateKey(getLocalWeekMonday(startDate))
        : null;
    const endBound = endDate
        ? formatLocalDateKey(getLocalWeekSunday(endDate))
        : null;

    return timecards.filter((timecard) => {
        const weekStart = timecard.weekStartDate;

        if (startBound && weekStart < startBound) return false;
        if (endBound && weekStart > endBound) return false;
        return true;
    });
}

export function TimecardListComponent({ timecards = [], error }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setCurrentPage(1);
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
                    <WeeklyTimecardComponent key={weekData.weekStartDate} weekData={weekData} />
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
