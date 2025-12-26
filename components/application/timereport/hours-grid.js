'use client';

import { useCallback, useMemo } from 'react';
import { X, Clock, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HoursGridPhone } from './hours-grid-phone';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Hours grid component for entering daily hours per project.
 * Displays a grid where rows are projects and columns are days.
 *
 * @param {Object} props
 * @param {Array} props.timeData - Array of { date, timeRows: [{ projectId, projectName, projectCode, hours }] }
 * @param {Date} props.selectedWeek - The Monday of the selected week
 * @param {Function} props.onTimeDataChange - Callback when hours change, receives updated timeData
 * @param {Function} props.onRemoveProject - Callback when removing a project
 * @param {Array} props.projects - Optional array of projects for color lookup (with flexId and color properties)
 * @param {Set} props.selectedProjects - Set of selected project IDs to display even without time entries
 * @param {boolean} props.disabled - Whether the grid inputs are disabled (read-only mode)
 */
export function HoursGridComponent({
    timeData = [],
    selectedWeek,
    onTimeDataChange,
    onRemoveProject,
    holidays,
    projects = [],
    selectedProjects = new Set(),
    disabled = false,
}) {
    const today = new Date();

    // Generate dates for the week
    const weekDates = useMemo(() => {
        const monday = new Date(selectedWeek);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }, [selectedWeek]);

    // Helper to check if a date is a holiday (uses local date, not UTC)
    const isHoliday = useCallback(
        (date) => {
            if (!holidays || holidays.size === 0) return false;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            return holidays.has(dateStr);
        },
        [holidays]
    );

    // Extract unique projects from timeData and selectedProjects
    const uniqueProjects = useMemo(() => {
        const projectMap = new Map();

        // First, add projects from timeData
        timeData.forEach((dayEntry) => {
            dayEntry.timeRows?.forEach((row) => {
                if (!projectMap.has(row.projectId)) {
                    // Try to find color from projects prop, fallback to generated color
                    const projectFromProps = projects.find((p) => p.flexId === row.projectId);
                    projectMap.set(row.projectId, {
                        projectId: row.projectId,
                        projectName: row.projectName,
                        projectCode: row.projectCode,
                        color: row.color || projectFromProps?.color || 'red',
                    });
                }
            });
        });

        // Then, add selected projects that aren't in timeData yet
        selectedProjects.forEach((projectId) => {
            if (!projectMap.has(projectId)) {
                const projectFromProps = projects.find((p) => p.flexId === projectId);
                if (projectFromProps) {
                    projectMap.set(projectId, {
                        projectId: projectId,
                        projectName: projectFromProps.name,
                        projectCode: projectFromProps.projectCode || '',
                        color: projectFromProps.color,
                    });
                }
            }
        });

        return Array.from(projectMap.values());
    }, [timeData, projects, selectedProjects]);

    // Build hours lookup: { [projectId]: { [dayIndex]: hours } }
    const hoursLookup = useMemo(() => {
        const lookup = {};

        timeData.forEach((dayEntry) => {
            const entryDate = new Date(dayEntry.date);
            // Find which day index this date corresponds to
            const dayIndex = weekDates.findIndex(
                (weekDate) => weekDate.toDateString() === entryDate.toDateString()
            );

            if (dayIndex >= 0) {
                dayEntry.timeRows?.forEach((row) => {
                    if (!lookup[row.projectId]) {
                        lookup[row.projectId] = {};
                    }
                    lookup[row.projectId][dayIndex] = row.hours;
                });
            }
        });

        return lookup;
    }, [timeData, weekDates]);

    // Calculate totals per day
    const dailyTotals = useMemo(() => {
        return Array.from({ length: 7 }, (_, dayIndex) => {
            return uniqueProjects.reduce((sum, project) => {
                return sum + (hoursLookup[project.projectId]?.[dayIndex] || 0);
            }, 0);
        });
    }, [uniqueProjects, hoursLookup]);

    // Calculate total for the week
    const weekTotal = useMemo(() => {
        return dailyTotals.reduce((sum, hours) => sum + hours, 0);
    }, [dailyTotals]);

    const handleHourChange = useCallback(
        (projectId, dayIndex, value) => {
            const numValue = parseFloat(value) || 0;
            const clampedValue = Math.max(0, Math.min(24, numValue));

            // Find the project info
            const project = uniqueProjects.find((p) => p.projectId === projectId);
            if (!project) return;

            // Get the date for this day index (use local date, not UTC)
            const targetDate = weekDates[dayIndex];
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const day = String(targetDate.getDate()).padStart(2, '0');
            const targetDateStr = `${year}-${month}-${day}T00:00:00`;

            // Clone timeData and update
            const newTimeData = [...timeData];

            // Find or create the day entry
            let dayEntryIndex = newTimeData.findIndex((entry) => {
                const entryDate = new Date(entry.date);
                return entryDate.toDateString() === targetDate.toDateString();
            });

            if (dayEntryIndex === -1) {
                // Create new day entry
                newTimeData.push({
                    date: targetDateStr,
                    timeRows: [],
                });
                dayEntryIndex = newTimeData.length - 1;
            }

            const dayEntry = { ...newTimeData[dayEntryIndex] };
            const timeRows = [...(dayEntry.timeRows || [])];

            // Find or create the time row for this project
            const timeRowIndex = timeRows.findIndex((row) => row.projectId === projectId);

            if (clampedValue === 0) {
                // Remove the time row if hours is 0
                if (timeRowIndex >= 0) {
                    timeRows.splice(timeRowIndex, 1);
                }
            } else {
                if (timeRowIndex >= 0) {
                    // Update existing
                    timeRows[timeRowIndex] = {
                        ...timeRows[timeRowIndex],
                        hours: clampedValue,
                    };
                } else {
                    // Add new
                    timeRows.push({
                        projectId: project.projectId,
                        projectName: project.projectName,
                        projectCode: project.projectCode,
                        hours: clampedValue,
                    });
                }
            }

            dayEntry.timeRows = timeRows;
            newTimeData[dayEntryIndex] = dayEntry;

            // Remove day entries with no time rows
            const filteredTimeData = newTimeData.filter(
                (entry) => entry.timeRows && entry.timeRows.length > 0
            );

            onTimeDataChange(filteredTimeData);
        },
        [timeData, weekDates, uniqueProjects, onTimeDataChange]
    );

    const handleRemoveProject = useCallback(
        (projectId) => {
            // Remove all time rows for this project from timeData
            const newTimeData = timeData
                .map((dayEntry) => ({
                    ...dayEntry,
                    timeRows: dayEntry.timeRows?.filter((row) => row.projectId !== projectId) || [],
                }))
                .filter((entry) => entry.timeRows.length > 0);

            onTimeDataChange(newTimeData);

            if (onRemoveProject) {
                onRemoveProject(projectId);
            }
        },
        [timeData, onTimeDataChange, onRemoveProject]
    );

    const handleFillFullTime = useCallback(
        (projectId) => {
            const project = uniqueProjects.find((p) => p.projectId === projectId);
            if (!project) return;

            // Fill 8 hours for Mon-Fri (indices 0-4)
            let newTimeData = [...timeData];

            for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
                const targetDate = weekDates[dayIndex];
                const year = targetDate.getFullYear();
                const month = String(targetDate.getMonth() + 1).padStart(2, '0');
                const day = String(targetDate.getDate()).padStart(2, '0');
                const targetDateStr = `${year}-${month}-${day}T00:00:00`;

                if (isHoliday(targetDate)) {
                    continue;
                }

                let dayEntryIndex = newTimeData.findIndex((entry) => {
                    const entryDate = new Date(entry.date);
                    return entryDate.toDateString() === targetDate.toDateString();
                });

                if (dayEntryIndex === -1) {
                    newTimeData.push({
                        date: targetDateStr,
                        timeRows: [],
                    });
                    dayEntryIndex = newTimeData.length - 1;
                }

                const dayEntry = { ...newTimeData[dayEntryIndex] };
                const timeRows = [...(dayEntry.timeRows || [])];
                const timeRowIndex = timeRows.findIndex((row) => row.projectId === projectId);

                if (timeRowIndex >= 0) {
                    timeRows[timeRowIndex] = { ...timeRows[timeRowIndex], hours: 8 };
                } else {
                    timeRows.push({
                        projectId: project.projectId,
                        projectName: project.projectName,
                        projectCode: project.projectCode,
                        hours: 8,
                    });
                }

                dayEntry.timeRows = timeRows;
                newTimeData[dayEntryIndex] = dayEntry;
            }

            onTimeDataChange(newTimeData);
        },
        [timeData, weekDates, uniqueProjects, onTimeDataChange]
    );

    const handleResetProject = useCallback(
        (projectId) => {
            // Set all hours to 0 for this project
            const newTimeData = timeData.map((dayEntry) => ({
                ...dayEntry,
                timeRows:
                    dayEntry.timeRows?.map((row) =>
                        row.projectId === projectId ? { ...row, hours: 0 } : row
                    ) || [],
            }));

            onTimeDataChange(newTimeData);
        },
        [timeData, onTimeDataChange]
    );

    if (uniqueProjects.length === 0) {
        return null;
    }

    return (
        <>
            {/* Mobile/Tablet Layout - Card-based view (visible below xl breakpoint) */}
            <div className="xl:hidden">
                <HoursGridPhone
                    weekDates={weekDates}
                    uniqueProjects={uniqueProjects}
                    hoursLookup={hoursLookup}
                    dailyTotals={dailyTotals}
                    weekTotal={weekTotal}
                    onHourChange={handleHourChange}
                    onRemoveProject={handleRemoveProject}
                    onFillFullTime={handleFillFullTime}
                    onResetProject={handleResetProject}
                    disabled={disabled}
                    holidays={holidays}
                />
            </div>

            {/* Desktop Layout - Grid view (visible at xl breakpoint and above) */}
            <div className="hidden xl:block space-y-4">
                {/* Hours grid */}
                <div>
                    <div>
                        {/* Day headers */}
                        <div className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(60px,1fr))_48px_72px] gap-1.5 items-center mb-2">
                            <div /> {/* Empty cell for project column */}
                            {weekDates.map((date, index) => {
                                const isToday = date.toDateString() === today.toDateString();
                                const isWeekend = index >= 5;
                                const isBankHoliday = isHoliday(date);
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'text-center py-2 rounded-md',
                                            isBankHoliday &&
                                                'bg-red-100 dark:bg-red-950/40 ring-1 ring-red-300 dark:ring-red-800',
                                            isToday &&
                                                !isBankHoliday &&
                                                'bg-primary/10 ring-1 ring-primary/20',
                                            isWeekend && !isToday && !isBankHoliday && 'bg-muted/30'
                                        )}
                                        title={isBankHoliday ? 'Bank Holiday' : undefined}
                                    >
                                        <p
                                            className={cn(
                                                'text-xs font-medium',
                                                isBankHoliday && 'text-red-600 dark:text-red-400',
                                                isToday && !isBankHoliday && 'text-primary',
                                                isWeekend &&
                                                    !isToday &&
                                                    !isBankHoliday &&
                                                    'text-muted-foreground'
                                            )}
                                        >
                                            {DAYS_SHORT[index]}
                                        </p>
                                        <p
                                            className={cn(
                                                'text-sm font-semibold',
                                                isBankHoliday && 'text-red-600 dark:text-red-400',
                                                isToday && !isBankHoliday && 'text-primary',
                                                isWeekend &&
                                                    !isToday &&
                                                    !isBankHoliday &&
                                                    'text-muted-foreground'
                                            )}
                                        >
                                            {date.getDate()}
                                        </p>
                                    </div>
                                );
                            })}
                            <div className="text-center text-xs font-medium text-muted-foreground">
                                Total
                            </div>
                            <div /> {/* Empty cell for action column */}
                        </div>

                        {/* Project rows */}
                        <div className="space-y-2">
                            {uniqueProjects.map((project) => {
                                const projectHours = hoursLookup[project.projectId] || {};
                                const projectTotal = Object.values(projectHours).reduce(
                                    (sum, h) => sum + h,
                                    0
                                );

                                return (
                                    <div
                                        key={project.projectId}
                                        className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(60px,1fr))_48px_72px] gap-1.5 items-center group"
                                    >
                                        {/* Project name with remove button */}
                                        <div className="flex items-center gap-2 pr-2">
                                            {!disabled && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemoveProject(project.projectId)
                                                    }
                                                    className="h-6 w-6 -ml-1 text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            <div
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: project.color }}
                                            />
                                            <span
                                                className="text-sm font-medium truncate"
                                                title={project.projectName}
                                            >
                                                {project.projectName}
                                            </span>
                                        </div>

                                        {/* Hour inputs for each day */}
                                        {weekDates.map((date, dayIndex) => {
                                            const isWeekend = dayIndex >= 5;
                                            const isToday =
                                                date.toDateString() === today.toDateString();
                                            const isBankHoliday = isHoliday(date);

                                            return (
                                                <Input
                                                    key={dayIndex}
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    step="0.5"
                                                    value={projectHours[dayIndex] || ''}
                                                    onChange={(e) =>
                                                        handleHourChange(
                                                            project.projectId,
                                                            dayIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0"
                                                    disabled={disabled}
                                                    title={
                                                        isBankHoliday ? 'Bank Holiday' : undefined
                                                    }
                                                    className={cn(
                                                        'text-center h-9 text-sm px-1 text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                                                        isBankHoliday &&
                                                            'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
                                                        isWeekend &&
                                                            !isBankHoliday &&
                                                            'bg-muted/50 text-muted-foreground',
                                                        isToday &&
                                                            !disabled &&
                                                            !isBankHoliday &&
                                                            'ring-1 ring-primary/30',
                                                        disabled && 'cursor-not-allowed bg-muted/40 text-muted-foreground disabled:opacity-100'
                                                    )}
                                                />
                                            );
                                        })}

                                        {/* Project total */}
                                        <div className="text-right">
                                            <span
                                                className={cn(
                                                    'text-sm font-semibold tabular-nums',
                                                    projectTotal > 0 && 'text-primary'
                                                )}
                                            >
                                                {projectTotal}h
                                            </span>
                                        </div>

                                        {/* Action buttons */}
                                        {!disabled && (
                                            <div className="flex items-center gap-0.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleFillFullTime(project.projectId)
                                                    }
                                                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                                                    title="Fill 8h for Mon-Fri"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleResetProject(project.projectId)
                                                    }
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                    title="Reset all hours"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {disabled && <div />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Totals row */}
                        <div className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(60px,1fr))_48px_72px] gap-1.5 items-center mt-3 pt-3 border-t">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Total
                            </div>
                            {dailyTotals.map((total, index) => {
                                const isOvertime = total > 8;
                                const isWeekend = index >= 5;
                                const isBankHoliday = isHoliday(weekDates[index]);

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'text-center text-sm font-semibold py-1.5 rounded tabular-nums',
                                            isBankHoliday &&
                                                'text-red-600 bg-red-100 dark:bg-red-950/40 dark:text-red-400',
                                            !isBankHoliday &&
                                                isOvertime &&
                                                'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
                                            !isBankHoliday &&
                                                total === 8 &&
                                                'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
                                            !isBankHoliday &&
                                                total > 0 &&
                                                total < 8 &&
                                                !isWeekend &&
                                                'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
                                            !isBankHoliday &&
                                                (total === 0 || isWeekend) &&
                                                'text-muted-foreground'
                                        )}
                                        title={isBankHoliday ? 'Bank Holiday' : undefined}
                                    >
                                        {total}h
                                    </div>
                                );
                            })}
                            <div className="text-right">
                                <span
                                    className={cn(
                                        'text-sm font-bold tabular-nums',
                                        weekTotal >= 40 && 'text-emerald-600',
                                        weekTotal > 0 && weekTotal < 40 && 'text-primary'
                                    )}
                                >
                                    {weekTotal}h
                                </span>
                            </div>
                            <div /> {/* Empty cell for action column */}
                        </div>
                    </div>
                </div>

                {/* Compact legend */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            8h
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            &gt;8h
                        </span>
                    </div>
                    <span>Target: {weekTotal}/40h</span>
                </div>
            </div>
        </>
    );
}
