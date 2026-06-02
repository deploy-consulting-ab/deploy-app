'use client';

import { useMemo } from 'react';
import { formatDateToISOString, isWeekend } from '@/lib/utils';
import { SWEDISH_BANK_HOLIDAYS } from '@/actions/flex/constants';
import { cn } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ENTRY_COLORS = {
    external: '#3b82f6',
    internal: '#6b7280',
    absence: '#ef4444',
};

function normalizeColor(color) {
    if (color === 'red') return ENTRY_COLORS.absence;
    return color || ENTRY_COLORS.external;
}

function getCalendarDays(startDate, endDate) {
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');

    const startDay = start.getUTCDay();
    const daysFromMonday = startDay === 0 ? 6 : startDay - 1;
    const gridStart = new Date(start);
    gridStart.setUTCDate(start.getUTCDate() - daysFromMonday);

    const endDay = end.getUTCDay();
    const daysToSunday = endDay === 0 ? 0 : 7 - endDay;
    const gridEnd = new Date(end);
    gridEnd.setUTCDate(end.getUTCDate() + daysToSunday);

    const days = [];
    const current = new Date(gridStart);
    while (current <= gridEnd) {
        days.push(formatDateToISOString(current));
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return days;
}

function formatHoursDisplay(hours) {
    if (!hours || hours === 0) return null;
    return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

function formatPeriodTitle(dateStr) {
    const d = new Date(dateStr + 'T00:00:00Z');
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function EntryPill({ row }) {
    const color = normalizeColor(row.color);
    const label = row.projectCode || row.projectName?.slice(0, 10) || '?';
    const hours = formatHoursDisplay(row.hours);

    return (
        <div
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight max-w-full"
            style={{
                backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`,
                color,
            }}
            title={`${row.projectName} – ${row.hours}h`}
        >
            <span className="truncate min-w-0">{label}</span>
            {hours && <span className="shrink-0 font-mono opacity-80">{hours}</span>}
        </div>
    );
}

function SummaryItem({ label, value, colorClass, valueClass }) {
    return (
        <div className={cn('flex flex-col rounded-lg border px-3 py-2.5', colorClass)}>
            <span className="text-[11px] font-medium uppercase tracking-wide opacity-60">{label}</span>
            <span className={cn('text-xl font-bold tabular-nums', valueClass)}>
                {value || '—'}
            </span>
        </div>
    );
}

function LegendDot({ color, label }) {
    return (
        <div className="flex items-center gap-1.5">
            <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{
                    backgroundColor: `color-mix(in oklch, ${color} 20%, transparent)`,
                    outline: `1px solid ${color}`,
                    outlineOffset: '0px',
                }}
            />
            <span>{label}</span>
        </div>
    );
}

function DayCell({ dateStr, entries, isCurrentMonth, today }) {
    const isToday = dateStr === today;
    const isWeekendDay = isWeekend(dateStr);
    const isBankHoliday = SWEDISH_BANK_HOLIDAYS.has(dateStr);
    const dayNumber = parseInt(dateStr.split('-')[2], 10);
    const totalHours = entries.reduce((sum, row) => sum + (row.hours || 0), 0);

    return (
        <div
            className={cn(
                'min-h-[100px] p-2 flex flex-col gap-1.5 border-b border-r border-border/40 relative overflow-hidden',
                !isCurrentMonth && 'opacity-20 bg-muted/10',
                isCurrentMonth && isWeekendDay && 'bg-muted/25',
                isCurrentMonth && isBankHoliday && 'bg-amber-50/60 dark:bg-amber-950/25',
                isToday && 'ring-2 ring-inset ring-primary/50',
            )}
        >
            <div className="flex items-start justify-between gap-1">
                <span
                    className={cn(
                        'text-xs font-semibold leading-none tabular-nums shrink-0 w-5 h-5 flex items-center justify-center rounded-full',
                        isToday
                            ? 'bg-primary text-primary-foreground text-[10px]'
                            : 'text-foreground/60',
                    )}
                >
                    {dayNumber}
                </span>
                <div className="flex flex-col items-end gap-0.5">
                    {isBankHoliday && isCurrentMonth && (
                        <span className="text-[9px] font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded leading-none">
                            SE Holiday
                        </span>
                    )}
                    {totalHours > 0 && (
                        <span className="text-[10px] text-muted-foreground font-mono leading-none">
                            {formatHoursDisplay(totalHours)}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-0.5 overflow-hidden">
                {entries.map((row, i) => (
                    <EntryPill key={i} row={row} />
                ))}
            </div>
        </div>
    );
}

export function OccupancyCalendarComponent({ timereports, startDate, endDate, today, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const title = formatPeriodTitle(startDate);

    const calendarDays = useMemo(() => getCalendarDays(startDate, endDate), [startDate, endDate]);

    const entriesByDate = useMemo(() => {
        const map = new Map();
        if (!timereports) return map;

        for (const entry of timereports) {
            const dateKey = formatDateToISOString(entry.date);
            if (!map.has(dateKey)) map.set(dateKey, []);
            map.get(dateKey).push(...(entry.timeRows || []));
        }
        return map;
    }, [timereports]);

    const stats = useMemo(() => {
        let external = 0;
        let internal = 0;
        let absence = 0;

        if (timereports) {
            for (const entry of timereports) {
                for (const row of (entry.timeRows || [])) {
                    const hours = row.hours || 0;
                    if (row.isWorkingTime) {
                        if (row.color === '#6b7280') internal += hours;
                        else external += hours;
                    } else {
                        absence += hours;
                    }
                }
            }
        }

        return { external, internal, absence, total: external + internal + absence };
    }, [timereports]);

    const workingDays = useMemo(() => {
        return calendarDays.filter((d) => {
            if (d < startDate || d > endDate) return false;
            if (isWeekend(d)) return false;
            if (SWEDISH_BANK_HOLIDAYS.has(d)) return false;
            return true;
        }).length;
    }, [calendarDays, startDate, endDate]);

    const weeks = useMemo(() => {
        const result = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            result.push(calendarDays.slice(i, i + 7));
        }
        return result;
    }, [calendarDays]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{workingDays} working days</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <SummaryItem
                    label="Total"
                    value={formatHoursDisplay(stats.total)}
                    colorClass="border-border bg-muted/30"
                    valueClass="text-foreground"
                />
                <SummaryItem
                    label="External"
                    value={formatHoursDisplay(stats.external)}
                    colorClass="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
                    valueClass="text-blue-600 dark:text-blue-400"
                />
                <SummaryItem
                    label="Internal"
                    value={formatHoursDisplay(stats.internal)}
                    colorClass="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
                    valueClass="text-gray-600 dark:text-gray-400"
                />
                <SummaryItem
                    label="Time Off"
                    value={formatHoursDisplay(stats.absence)}
                    colorClass="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
                    valueClass="text-red-600 dark:text-red-400"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border border-border/40">
                <div className="min-w-[560px]">
                    <div className="grid grid-cols-7 border-b border-border/40">
                        {DAY_LABELS.map((day) => (
                            <div
                                key={day}
                                className={cn(
                                    'py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r border-border/40 last:border-r-0',
                                    (day === 'Sat' || day === 'Sun') && 'bg-muted/20',
                                )}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div>
                        {weeks.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7">
                                {week.map((dateStr) => (
                                    <DayCell
                                        key={dateStr}
                                        dateStr={dateStr}
                                        entries={entriesByDate.get(dateStr) || []}
                                        isCurrentMonth={dateStr >= startDate && dateStr <= endDate}
                                        today={today}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <LegendDot color={ENTRY_COLORS.external} label="External project" />
                <LegendDot color={ENTRY_COLORS.internal} label="Internal project" />
                <LegendDot color={ENTRY_COLORS.absence} label="Absence / time off" />
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm shrink-0 bg-amber-100 dark:bg-amber-900/40 ring-1 ring-amber-400" />
                    <span>SE bank holiday</span>
                </div>
            </div>
        </div>
    );
}
