'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReadOnlyCalendar } from '@/components/ui/read-only-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock, ArrowRight, CalendarDays } from 'lucide-react'
import { enGB } from 'react-day-picker/locale'
import { cn } from '@/lib/utils'

/**
 * Format a local Date object to YYYY-MM-DD string using local timezone.
 * Use this for dates from the calendar picker to avoid UTC timezone shifts.
 */
const formatLocalDate = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Format a local Date object to a friendly display format (e.g., "23 Jan 2026")
 */
const formatDisplayDate = (date) => {
    if (!date) return ''
    const day = date.getDate()
    const month = date.toLocaleDateString('en-GB', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
}

export function HolidaysRequestComponent() {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [hours, setHours] = useState(8)
    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)

    const isSameDay = startDate && endDate &&
        formatLocalDate(startDate) === formatLocalDate(endDate)

    const calculateDays = () => {
        if (!startDate || !endDate) return 0
        if (isSameDay) return 1

        const start = new Date(startDate)
        const end = new Date(endDate)

        // Calculate the difference in days
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        return diffDays
    }

    const handleStartDateSelect = (date) => {
        setStartDate(date)
        setStartDateOpen(false)

        // If end date is before start date, reset it
        if (endDate && date && formatLocalDate(date) > formatLocalDate(endDate)) {
            setEndDate(date)
        }
    }

    const handleEndDateSelect = (date) => {
        setEndDate(date)
        setEndDateOpen(false)
    }

    const handleHoursChange = (e) => {
        let value = parseFloat(e.target.value)

        if (isNaN(value) || value < 0) {
            setHours('')
            return
        }

        // Auto-set to 8 if value exceeds 8
        if (value > 8) {
            value = 8
        }

        setHours(value)
    }

    // Reset hours to 8 when switching to multi-day selection
    useEffect(() => {
        if (!isSameDay && startDate && endDate) {
            setHours(8)
        }
    }, [isSameDay, startDate, endDate])

    const numberOfDays = calculateDays()

    return (
        <div className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Select Period</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Start Date */}
                    <div className="flex-1">
                        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="start-date"
                                    variant="outline"
                                    className={cn(
                                        'w-full h-12 justify-start text-left font-normal',
                                        !startDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-muted-foreground">From</span>
                                        <span className="truncate">
                                            {startDate ? formatDisplayDate(startDate) : 'Select start date'}
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

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* End Date */}
                    <div className="flex-1">
                        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="end-date"
                                    variant="outline"
                                    className={cn(
                                        'w-full h-12 justify-start text-left font-normal',
                                        !endDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-muted-foreground">To</span>
                                        <span className="truncate">
                                            {endDate ? formatDisplayDate(endDate) : 'Select end date'}
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

            {/* Hours Input - Only show when dates are selected */}
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

            {/* Summary Card */}
            {startDate && endDate && (
                <div className="rounded-lg bg-muted/50 border p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Request Summary</p>
                            <p className="text-sm text-muted-foreground">
                                {isSameDay ? (
                                    <>
                                        <span className="font-medium text-foreground">{hours || 0} hour{hours !== 1 ? 's' : ''}</span>
                                        {' '}on {formatDisplayDate(startDate)}
                                    </>
                                ) : (
                                    <>
                                        {formatDisplayDate(startDate)} — {formatDisplayDate(endDate)}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-semibold">
                                {isSameDay ? (hours || 0) : numberOfDays}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {isSameDay ? (hours === 1 ? 'hour' : 'hours') : (numberOfDays === 1 ? 'day' : 'days')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}