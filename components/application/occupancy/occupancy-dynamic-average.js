'use client';

import { useState, useTransition } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2, CalendarSearch } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getOccupancyAverageByDateRange } from '@/actions/salesforce/salesforce-actions';
import { getOccupancyLevel } from '@/components/application/occupancy/occupancy-chart-shared';

function OccupancyRateBadge({ rate }) {
    const level = getOccupancyLevel(rate);
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
                backgroundColor: `color-mix(in oklch, ${level.color} 18%, transparent)`,
                color: level.color,
            }}
        >
            {level.label}
        </span>
    );
}

export function OccupancyDynamicAverageComponent({ employeeNumber, defaultStartDate, defaultEndDate }) {
    const [startDate, setStartDate] = useState(defaultStartDate ? parseISO(defaultStartDate) : undefined);
    const [endDate, setEndDate] = useState(defaultEndDate ? parseISO(defaultEndDate) : undefined);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) return;

        startTransition(async () => {
            try {
                setError(null);
                const data = await getOccupancyAverageByDateRange(
                    employeeNumber,
                    format(startDate, 'yyyy-MM-dd'),
                    format(endDate, 'yyyy-MM-dd')
                );
                setResult(data);
            } catch (err) {
                setError(err?.message || 'Failed to fetch data');
                setResult(null);
            }
        });
    };

    const level = result?.average != null ? getOccupancyLevel(result.average) : null;
    const formattedAverage = result?.average != null ? `${result.average}%` : null;

    return (
        <Card className="p-5 border-border/50">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <CalendarSearch className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                        Dynamic Average Occupancy Rate
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">From</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!startDate}
                                        className="h-8 w-full justify-start text-left text-sm font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
                                        {startDate ? format(startDate, 'MMM d, yyyy') : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        disabled={(date) => endDate ? date > endDate : false}
                                        initialFocus
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">To</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!endDate}
                                        className="h-8 w-full justify-start text-left text-sm font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
                                        {endDate ? format(endDate, 'MMM d, yyyy') : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        disabled={(date) => startDate ? date < startDate : false}
                                        initialFocus
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        size="sm"
                        disabled={isPending || !startDate || !endDate}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                Calculating…
                            </>
                        ) : (
                            'Calculate'
                        )}
                    </Button>
                </form>

                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}

                {result != null && !error && (
                    <div className="pt-3 border-t border-border/40">
                        {result.count === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No occupancy data found for this period.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-end justify-between gap-2">
                                    <span
                                        className="text-3xl font-bold tabular-nums"
                                        style={{ color: level?.color }}
                                    >
                                        {formattedAverage}
                                    </span>
                                    <OccupancyRateBadge rate={result.average} />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Average across {result.count} month{result.count !== 1 ? 's' : ''}
                                </p>
                                {result.months?.length > 0 && (
                                    <div className="mt-1 space-y-1 max-h-40 overflow-y-auto">
                                        {result.months.map((m, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between text-sm text-muted-foreground"
                                            >
                                                <span>{m.month} {m.year}</span>
                                                <span className="font-mono font-medium text-sm text-foreground">
                                                    {m.rate}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
