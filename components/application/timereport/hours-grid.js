'use client';

import { useCallback } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Hours grid component for entering daily hours per project.
 * Displays a grid where rows are projects and columns are days.
 */
export function HoursGrid({
    projects,
    selectedProjects,
    hours,
    onHoursChange,
    onRemoveProject,
    selectedWeek,
}) {
    const today = new Date();
    const selectedMonday = new Date(selectedWeek);

    // Generate dates for the week
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(selectedMonday);
        date.setDate(selectedMonday.getDate() + i);
        return date;
    });

    // Calculate totals per day
    const dailyTotals = Array.from({ length: 7 }, (_, dayIndex) => {
        return selectedProjects.reduce((sum, projectId) => {
            return sum + (hours[projectId]?.[dayIndex] || 0);
        }, 0);
    });

    // Calculate total for the week
    const weekTotal = dailyTotals.reduce((sum, hours) => sum + hours, 0);

    const handleHourChange = useCallback(
        (projectId, dayIndex, value) => {
            const numValue = parseFloat(value) || 0;
            const clampedValue = Math.max(0, Math.min(24, numValue));
            onHoursChange(projectId, dayIndex, clampedValue);
        },
        [onHoursChange]
    );

    if (selectedProjects.length === 0) {
        return null;
    }

    const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="space-y-4">
            {/* Hours grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Day headers */}
                    <div className="grid grid-cols-[minmax(140px,1fr)_repeat(7,minmax(52px,1fr))_60px] gap-1.5 items-center mb-2">
                        <div /> {/* Empty cell for project column */}
                        {weekDates.map((date, index) => {
                            const isToday = date.toDateString() === today.toDateString();
                            const isWeekend = index >= 5;

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        'text-center py-2 rounded-md',
                                        isToday && 'bg-primary/10 ring-1 ring-primary/20',
                                        isWeekend && !isToday && 'bg-muted/30'
                                    )}
                                >
                                    <p
                                        className={cn(
                                            'text-xs font-medium',
                                            isToday && 'text-primary',
                                            isWeekend && !isToday && 'text-muted-foreground'
                                        )}
                                    >
                                        {DAYS_SHORT[index]}
                                    </p>
                                    <p
                                        className={cn(
                                            'text-sm font-semibold',
                                            isToday && 'text-primary',
                                            isWeekend && !isToday && 'text-muted-foreground'
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
                    </div>

                    {/* Project rows */}
                    <div className="space-y-2">
                        {selectedProjects.map((projectId) => {
                            console.log('## projectId', projectId);
                            const project = projects.find((p) => p.id === projectId);
                            if (!project) return null;

                            const projectHours = hours[projectId] || [0, 0, 0, 0, 0, 0, 0];
                            const projectTotal = projectHours.reduce((sum, h) => sum + h, 0);

                            return (
                                <div
                                    key={projectId}
                                    className="grid grid-cols-[minmax(140px,1fr)_repeat(7,minmax(52px,1fr))_60px] gap-1.5 items-center group"
                                >
                                    {/* Project name with remove button */}
                                    <div className="flex items-center gap-2 pr-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemoveProject(projectId)}
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                        <div
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: project.color }}
                                        />
                                        <span className="text-sm font-medium truncate">
                                            {project.name}
                                        </span>
                                    </div>

                                    {/* Hour inputs for each day */}
                                    {weekDates.map((date, dayIndex) => {
                                        const isWeekend = dayIndex >= 5;
                                        const isToday = date.toDateString() === today.toDateString();
                                        const isFuture = date > today;

                                        return (
                                            <Input
                                                key={dayIndex}
                                                type="number"
                                                min="0"
                                                max="24"
                                                step="0.5"
                                                value={projectHours[dayIndex] || ''}
                                                onChange={(e) =>
                                                    handleHourChange(projectId, dayIndex, e.target.value)
                                                }
                                                placeholder="0"
                                                className={cn(
                                                    'text-center h-9 text-sm px-1',
                                                    isWeekend && 'bg-muted/30',
                                                    isToday && 'ring-1 ring-primary/30',
                                                    isFuture && 'opacity-50'
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
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals row */}
                    <div className="grid grid-cols-[minmax(140px,1fr)_repeat(7,minmax(52px,1fr))_60px] gap-1.5 items-center mt-3 pt-3 border-t">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Total
                        </div>
                        {dailyTotals.map((total, index) => {
                            const isOvertime = total > 8;
                            const isWeekend = index >= 5;

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        'text-center text-sm font-semibold py-1.5 rounded tabular-nums',
                                        isOvertime && 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
                                        total === 8 &&
                                            'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
                                        total > 0 &&
                                            total < 8 &&
                                            !isWeekend &&
                                            'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
                                        (total === 0 || isWeekend) && 'text-muted-foreground'
                                    )}
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
    );
}
