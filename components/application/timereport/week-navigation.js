'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeekMonday, getWeekNumber, formatDateDayMonth, getUTCToday } from '@/lib/utils';

/**
 * Week navigation component for selecting time report weeks.
 * Allows navigating to previous weeks and returning to current week.
 */
export function WeekNavigation({ selectedWeek, onWeekChange }) {
    const currentWeekMonday = getWeekMonday(getUTCToday());
    const selectedMonday = getWeekMonday(selectedWeek);

    const isCurrentWeek = selectedMonday.getTime() === currentWeekMonday.getTime();
    const weekNumber = getWeekNumber(selectedMonday);

    // Calculate Sunday of the selected week (use UTC methods for consistency)
    const selectedSunday = new Date(selectedMonday);
    selectedSunday.setUTCDate(selectedMonday.getUTCDate() + 6);

    const handlePreviousWeek = () => {
        const newDate = new Date(selectedMonday);
        newDate.setUTCDate(newDate.getUTCDate() - 7);
        onWeekChange(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(selectedMonday);
        newDate.setUTCDate(newDate.getUTCDate() + 7);
        onWeekChange(newDate);
    };

    const handleCurrentWeek = () => {
        onWeekChange(currentWeekMonday);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousWeek}
                    className="h-8 w-8 shrink-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-muted/50 rounded-lg justify-center flex-1 sm:flex-initial sm:min-w-[200px]">
                    <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <span className="font-medium text-sm">Week {weekNumber}</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                        ({formatDateDayMonth(selectedMonday)} - {formatDateDayMonth(selectedSunday)}
                        )
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextWeek}
                    className="h-8 w-8 shrink-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {!isCurrentWeek && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCurrentWeek}
                    className="text-xs w-full sm:w-auto"
                >
                    Go to current week
                </Button>
            )}
        </div>
    );
}
