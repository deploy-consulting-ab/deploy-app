'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    formatDateToSwedish,
    formatLocalDateKey,
    isLocalDateKeyInRange,
    parseToLocalDate,
} from '@/lib/utils';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyTimecardComponent({
    weekData,
    filterStartDate = null,
    filterEndDate = null,
}) {
    const { weekStartDate, weekEndDate, hours } = weekData;
    const weekStart = parseToLocalDate(weekStartDate);

    const startBound = filterStartDate ? formatLocalDateKey(filterStartDate) : null;
    const endBound = filterEndDate ? formatLocalDateKey(filterEndDate) : null;
    const hasFilter = Boolean(startBound || endBound);

    const visibleDays = hours.flatMap((dayHours, index) => {
        const dayDate = new Date(
            weekStart.getFullYear(),
            weekStart.getMonth(),
            weekStart.getDate() + index
        );
        const dayKey = formatLocalDateKey(dayDate);

        if (hasFilter && !isLocalDateKeyInRange(dayKey, startBound, endBound)) {
            return [];
        }

        return [{ dayHours, index, dayDate, dayKey }];
    });

    const totalHours = visibleDays.reduce((sum, { dayHours }) => sum + dayHours, 0);

    const displayStartDate =
        hasFilter && visibleDays.length > 0 ? visibleDays[0].dayKey : weekStartDate;
    const displayEndDate =
        hasFilter && visibleDays.length > 0
            ? visibleDays[visibleDays.length - 1].dayKey
            : weekEndDate;

    if (visibleDays.length === 0) {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                        {formatDateToSwedish(displayStartDate)} to{' '}
                        {formatDateToSwedish(displayEndDate)}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">Total: {totalHours}h</span>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))`,
                    }}
                >
                    {visibleDays.map(({ dayHours, index, dayDate, dayKey }) => (
                        <div
                            key={dayKey}
                            className="flex flex-col items-center p-2 rounded-md bg-muted/50"
                        >
                            <span className="text-xs text-muted-foreground">
                                {DAYS_OF_WEEK[index].slice(0, 3)} {dayDate.getDate()}
                            </span>
                            <span className="text-sm font-medium">{dayHours}h</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
