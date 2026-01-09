'use client';

import { X, Clock, RotateCcw, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, isHolidayDate, getUTCToday, formatDateToISOString } from '@/lib/utils';

const DAYS_SINGLE = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Mobile hours grid component - Card-based layout for phone screens.
 *
 * @param {Object} props
 * @param {Array} props.weekDates - Array of 7 Date objects for the week
 * @param {Array} props.uniqueProjects - Array of { projectId, projectName, projectCode, color }
 * @param {Object} props.hoursLookup - { [projectId]: { [dayIndex]: hours } }
 * @param {Array} props.dailyTotals - Array of 7 numbers representing daily totals
 * @param {number} props.weekTotal - Total hours for the week
 * @param {Function} props.onHourChange - Callback (projectId, dayIndex, value) => void
 * @param {Function} props.onRemoveProject - Callback (projectId) => void
 * @param {Function} props.onFillFullTime - Callback (projectId) => void
 * @param {Function} props.onResetProject - Callback (projectId) => void
 * @param {boolean} props.disabled - Whether inputs are disabled
 * @param {Set} props.holidays - Set of holiday date strings (YYYY-MM-DD format)
 * @param {boolean} props.isPastWeek - Whether the selected week is in the past
 * @param {Array} props.initialTimeData - Initial time data from Flex (for sync status)
 * @param {Array} props.timeData - Current time data
 * @param {boolean} props.isCheckmarked - Whether the timecard is checkmarked
 */
export function HoursGridPhone({
    weekDates,
    uniqueProjects,
    hoursLookup,
    dailyTotals,
    weekTotal,
    onHourChange,
    onRemoveProject,
    onFillFullTime,
    onResetProject,
    disabled = false,
    holidays,
    isPastWeek,
    initialTimeData = [],
    timeData = [],
    isCheckmarked = false,
}) {
    const today = getUTCToday();

    // Check if a cell's value matches the initial synced data from Flex
    const isCellSynced = (projectId, dayIndex) => {
        const targetDate = weekDates[dayIndex];
        const targetDateStr = formatDateToISOString(targetDate);

        const initialDayEntry = initialTimeData.find(
            (entry) => formatDateToISOString(entry.date) === targetDateStr
        );

        const currentDayEntry = timeData.find(
            (entry) => formatDateToISOString(entry.date) === targetDateStr
        );

        const initialRow = initialDayEntry?.timeRows?.find((r) => r.projectId === projectId);
        const currentRow = currentDayEntry?.timeRows?.find((r) => r.projectId === projectId);

        // Synced if values match the initial data from Flex
        return (initialRow?.hours || 0) === (currentRow?.hours || 0);
    };

    return (
        <div className="space-y-4">
            {/* Week summary header */}
            <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-medium text-muted-foreground">Week Total</span>
                    <span
                        className={cn(
                            'text-lg font-bold tabular-nums',
                            weekTotal >= 40 && 'text-emerald-600',
                            weekTotal > 0 && weekTotal < 40 && 'text-primary'
                        )}
                    >
                        {weekTotal}/40h
                    </span>
                </div>
                {!isPastWeek && (
                    <div className="text-center">
                        <span
                            className={cn(
                                'text-xs flex items-center justify-center gap-1.5',
                                isCheckmarked
                                    ? 'text-emerald-600 dark:text-emerald-500'
                                    : 'text-muted-foreground'
                            )}
                        >
                            <Check className="h-3 w-3" />
                            {isCheckmarked ? 'All Checkmarked' : 'Not checkmarked'}
                        </span>
                    </div>
                )}
            </div>

            {/* Daily totals row */}
            <div className="grid grid-cols-7 gap-1 bg-muted/30 rounded-lg p-2">
                {weekDates.map((date, index) => {
                    const isToday = formatDateToISOString(date) === formatDateToISOString(today);
                    const isWeekendDay = index >= 5;
                    const total = dailyTotals[index];
                    const isOvertime = total > 8;
                    const isBankHoliday = isHolidayDate(date, holidays);

                    return (
                        <div
                            key={index}
                            className={cn(
                                'flex flex-col items-center py-1.5 rounded-md',
                                isBankHoliday && 'bg-red-100 dark:bg-red-950/40',
                                isToday && !isBankHoliday && 'bg-primary/10'
                            )}
                            title={isBankHoliday ? 'Bank Holiday' : undefined}
                        >
                            <span
                                className={cn(
                                    'text-[10px] font-medium',
                                    isBankHoliday && 'text-red-600 dark:text-red-400',
                                    isToday && !isBankHoliday && 'text-primary',
                                    isWeekendDay &&
                                        !isToday &&
                                        !isBankHoliday &&
                                        'text-muted-foreground'
                                )}
                            >
                                {DAYS_SINGLE[index]}
                            </span>
                            <span
                                className={cn(
                                    'text-xs font-semibold',
                                    isBankHoliday && 'text-red-600 dark:text-red-400',
                                    isToday && !isBankHoliday && 'text-primary',
                                    isWeekendDay &&
                                        !isToday &&
                                        !isBankHoliday &&
                                        'text-muted-foreground'
                                )}
                            >
                                {date.getUTCDate()}
                            </span>
                            <span
                                className={cn(
                                    'text-[10px] font-semibold tabular-nums mt-0.5',
                                    isBankHoliday && 'text-red-600 dark:text-red-400',
                                    !isBankHoliday && isOvertime && 'text-amber-600',
                                    !isBankHoliday && total === 8 && 'text-emerald-600',
                                    !isBankHoliday &&
                                        total > 0 &&
                                        total < 8 &&
                                        !isWeekendDay &&
                                        'text-blue-600',
                                    !isBankHoliday &&
                                        (total === 0 || isWeekendDay) &&
                                        'text-muted-foreground'
                                )}
                            >
                                {total}h
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Project cards */}
            <div className="space-y-3">
                {uniqueProjects.map((project) => {
                    const projectHours = hoursLookup[project.projectId] || {};
                    const projectTotal = Object.values(projectHours).reduce((sum, h) => sum + h, 0);
                    const isWorkingTime = project.isWorkingTime;

                    return (
                        <div
                            key={project.projectId}
                            className="bg-card border rounded-xl p-3 space-y-3"
                        >
                            {/* Project header */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: project.color }}
                                    />
                                    <span
                                        className="text-sm font-medium truncate"
                                        title={project.projectName}
                                    >
                                        {project.projectName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <span
                                        className={cn(
                                            'text-sm font-bold tabular-nums',
                                            projectTotal > 0 && 'text-primary'
                                        )}
                                    >
                                        {projectTotal}h
                                    </span>
                                    {!disabled && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onFillFullTime(project.projectId)}
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                title="Fill 8h for Mon-Fri"
                                            >
                                                <Clock className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onResetProject(project.projectId)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                title="Reset all hours"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRemoveProject(project.projectId)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                title="Remove project"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Days grid - 7 columns */}
                            <div className="grid grid-cols-7 gap-1.5">
                                {weekDates.map((date, dayIndex) => {
                                    const isWeekendDay = dayIndex >= 5;
                                    const isToday =
                                        formatDateToISOString(date) ===
                                        formatDateToISOString(today);
                                    const isBankHoliday = isHolidayDate(date, holidays);
                                    const hasHours = projectHours[dayIndex] > 0;
                                    const isSynced = isCellSynced(project.projectId, dayIndex);

                                    return (
                                        <div
                                            key={dayIndex}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <span
                                                className={cn(
                                                    'text-[10px] font-medium',
                                                    isBankHoliday &&
                                                        'text-red-600 dark:text-red-400',
                                                    isToday && !isBankHoliday && 'text-primary',
                                                    isWeekendDay &&
                                                        !isToday &&
                                                        !isBankHoliday &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {DAYS_SINGLE[dayIndex]}
                                            </span>
                                            <div className="relative w-full">
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    min="0"
                                                    max="24"
                                                    step="0.5"
                                                    value={projectHours[dayIndex] || ''}
                                                    onChange={(e) =>
                                                        onHourChange(
                                                            project.projectId,
                                                            dayIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0"
                                                    disabled={disabled}
                                                    title={
                                                        isBankHoliday
                                                            ? 'Bank Holiday'
                                                            : isSynced && hasHours
                                                              ? 'Synced to Flex'
                                                              : !isSynced && hasHours
                                                                ? 'Not yet saved to Flex'
                                                                : undefined
                                                    }
                                                    className={cn(
                                                        'text-center h-10 px-0.5 w-full text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-none transition-opacity',
                                                        !isSynced &&
                                                            hasHours &&
                                                            !disabled &&
                                                            'opacity-70',
                                                        isBankHoliday &&
                                                            'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
                                                        !isWorkingTime &&
                                                            hasHours &&
                                                            'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
                                                        isWeekendDay &&
                                                            !isBankHoliday &&
                                                            'bg-muted/50 text-muted-foreground',
                                                        isToday &&
                                                            !disabled &&
                                                            !isBankHoliday &&
                                                            'ring-1 ring-primary/30',
                                                        isPastWeek &&
                                                            hasHours &&
                                                            !isWeekendDay &&
                                                            isWorkingTime &&
                                                            'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
                                                        disabled &&
                                                            !isBankHoliday &&
                                                            !(!isWorkingTime && hasHours) &&
                                                            'cursor-not-allowed bg-muted/40 text-muted-foreground disabled:opacity-100',
                                                        disabled &&
                                                            (isBankHoliday ||
                                                                (!isWorkingTime && hasHours)) &&
                                                            'cursor-not-allowed disabled:opacity-100'
                                                    )}
                                                />
                                                {isSynced && hasHours && (
                                                    <div className="absolute -bottom-1 -right-1 pointer-events-none">
                                                        <Check className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        8h
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        &gt;8h
                    </span>
                </div>
            </div>
        </div>
    );
}
