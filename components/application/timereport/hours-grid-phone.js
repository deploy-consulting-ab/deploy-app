'use client';

import { X, Clock, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, isHolidayDate } from '@/lib/utils';

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
}) {
    const today = new Date();

    return (
        <div className="space-y-4">
            {/* Week summary header */}
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

            {/* Daily totals row */}
            <div className="grid grid-cols-7 gap-1 bg-muted/30 rounded-lg p-2">
                {weekDates.map((date, index) => {
                    const isToday = date.toDateString() === today.toDateString();
                    const isWeekend = index >= 5;
                    const total = dailyTotals[index];
                    const isOvertime = total > 8;
                    const isBankHoliday = isHolidayDate(date, holidays);

                    return (
                        <div
                            key={index}
                            className={cn(
                                'flex flex-col items-center py-1.5 rounded-md',
                                isBankHoliday &&
                                    'bg-red-100 dark:bg-red-950/40 ring-1 ring-red-300 dark:ring-red-800',
                                isToday && !isBankHoliday && 'bg-primary/10 ring-1 ring-primary/30'
                            )}
                            title={isBankHoliday ? 'Bank Holiday' : undefined}
                        >
                            <span
                                className={cn(
                                    'text-[10px] font-medium',
                                    isBankHoliday && 'text-red-600 dark:text-red-400',
                                    isToday && !isBankHoliday && 'text-primary',
                                    isWeekend &&
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
                                    isWeekend &&
                                        !isToday &&
                                        !isBankHoliday &&
                                        'text-muted-foreground'
                                )}
                            >
                                {date.getDate()}
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
                                        !isWeekend &&
                                        'text-blue-600',
                                    !isBankHoliday &&
                                        (total === 0 || isWeekend) &&
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
                                    const isWeekend = dayIndex >= 5;
                                    const isToday = date.toDateString() === today.toDateString();
                                    const isBankHoliday = isHolidayDate(date, holidays);
                                    const hasHours = projectHours[dayIndex] > 0;

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
                                                    isWeekend &&
                                                        !isToday &&
                                                        !isBankHoliday &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {DAYS_SINGLE[dayIndex]}
                                            </span>
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
                                                title={isBankHoliday ? 'Bank Holiday' : undefined}
                                                className={cn(
                                                    'text-center h-10 text-sm px-0.5 w-full text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                                                    isBankHoliday &&
                                                        'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
                                                    !isWorkingTime &&
                                                        hasHours &&
                                                        'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
                                                    isWeekend &&
                                                        !isBankHoliday &&
                                                        'bg-muted/50 text-muted-foreground',
                                                    isToday &&
                                                        !disabled &&
                                                        !isBankHoliday &&
                                                        'ring-2 ring-primary/40',
                                                    disabled &&
                                                        'cursor-not-allowed bg-muted/40 text-muted-foreground disabled:opacity-100'
                                                )}
                                            />
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
