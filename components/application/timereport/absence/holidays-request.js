'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReadOnlyCalendar } from '@/components/ui/read-only-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
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
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id="start-date"
                                variant="outline"
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !startDate && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {startDate ? formatLocalDate(startDate) : 'Select date'}
                                </span>
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

                {/* End Date */}
                <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id="end-date"
                                variant="outline"
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !endDate && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {endDate ? formatLocalDate(endDate) : 'Select date'}
                                </span>
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

            {/* Hours Input */}
            <div className="space-y-2">
                <Label htmlFor="hours">
                    Hours
                    {!isSameDay && startDate && endDate && (
                        <span className="text-muted-foreground font-normal ml-2">
                            (Full days only for multi-day requests)
                        </span>
                    )}
                </Label>
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
                        'w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                        !isSameDay && 'opacity-50'
                    )}
                />
            </div>

            {/* Summary */}
            {startDate && endDate && (
                <div className="text-sm text-muted-foreground pt-2 border-t">
                    {isSameDay ? (
                        <p>Requesting {hours || 0} hour{hours !== 1 ? 's' : ''} on {formatLocalDate(startDate)}</p>
                    ) : (
                        <p>Requesting {numberOfDays} day{numberOfDays !== 1 ? 's' : ''} from {formatLocalDate(startDate)} to {formatLocalDate(endDate)}</p>
                    )}
                </div>
            )}
        </div>
    )
}