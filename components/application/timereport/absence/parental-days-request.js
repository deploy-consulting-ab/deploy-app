'use client';

import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReadOnlyCalendar } from '@/components/ui/read-only-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, ArrowRight, CalendarDays } from 'lucide-react';
import { enGB } from 'react-day-picker/locale';
import { cn } from '@/lib/utils';
import {
    formatDisplayDate,
    useAbsenceRequestForm,
} from '@/components/application/timereport/absence/utils-absence';

export const ParentalDaysRequestComponent = forwardRef(function ParentalDaysRequestComponent(
    { onValidityChange },
    ref
) {
    const {
        startDate,
        endDate,
        hours,
        isSameDay,
        startDateOpen,
        setStartDateOpen,
        endDateOpen,
        setEndDateOpen,
        handleStartDateSelect,
        handleEndDateSelect,
        handleHoursChange,
        numberOfDays,
    } = useAbsenceRequestForm(ref, onValidityChange);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Select Period</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1">
                        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="start-date"
                                    variant="outline"
                                    className={cn(
                                        'w-full h-12 justify-start text-left font-normal',
                                        !startDate && 'text-muted-foreground',
                                        'hover:cursor-pointer'
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-muted-foreground">From</span>
                                        <span className="truncate">
                                            {startDate
                                                ? formatDisplayDate(startDate)
                                                : 'Select start date'}
                                        </span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <ReadOnlyCalendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={handleStartDateSelect}
                                    initialFocus
                                    locale={enGB}
                                    defaultMonth={startDate || undefined}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="hidden sm:flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="end-date"
                                    variant="outline"
                                    className={cn(
                                        'w-full h-12 justify-start text-left font-normal',
                                        !endDate && 'text-muted-foreground',
                                        'hover:cursor-pointer'
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-muted-foreground">To</span>
                                        <span className="truncate">
                                            {endDate
                                                ? formatDisplayDate(endDate)
                                                : 'Select end date'}
                                        </span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <ReadOnlyCalendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={handleEndDateSelect}
                                    initialFocus
                                    locale={enGB}
                                    defaultMonth={endDate || startDate || undefined}
                                    disabled={startDate ? { before: startDate } : undefined}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {startDate && endDate && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Hours per day</span>
                        {!isSameDay && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                Multi-day: 8h fixed
                            </span>
                        )}
                    </div>

                    <Input
                        id="hours"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="8"
                        step="0.5"
                        value={hours}
                        onChange={handleHoursChange}
                        disabled={!isSameDay}
                        placeholder="8"
                        className={cn(
                            'h-12 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                            !isSameDay && 'opacity-50 cursor-not-allowed'
                        )}
                    />
                </div>
            )}

            {startDate && endDate && (
                <div className="rounded-lg bg-muted/50 border p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Request Summary</p>
                            <p className="text-sm text-muted-foreground">
                                {isSameDay ? (
                                    <>
                                        <span className="font-medium text-foreground">
                                            {hours || 0} hour{hours !== 1 ? 's' : ''}
                                        </span>{' '}
                                        on {formatDisplayDate(startDate)}
                                    </>
                                ) : (
                                    <>
                                        {formatDisplayDate(startDate)} —{' '}
                                        {formatDisplayDate(endDate)}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-semibold">
                                {isSameDay ? hours || 0 : numberOfDays}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {isSameDay
                                    ? hours === 1
                                        ? 'hour'
                                        : 'hours'
                                    : numberOfDays === 1
                                      ? 'day'
                                      : 'days'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
