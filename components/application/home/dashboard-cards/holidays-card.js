'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { formatDateToEnUSWithOptions } from '@/lib/utils';
import Link from 'next/link';
import { HOLIDAYS_ROUTE } from '@/menus/routes';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Wrapper component for use from Server Components.
 * Handles useTransition internally so parent doesn't need to manage refresh state.
 */
export function HolidaysCardWithRefresh({
    holidays,
    error,
    refreshAction,
    isNavigationDisabled = false,
}) {
    const [isPending, startTransition] = useTransition();

    function handleRefresh() {
        startTransition(async () => {
            await refreshAction();
        });
    }

    return (
        <HolidaysCardComponent
            holidays={holidays}
            error={error}
            onRefresh={refreshAction ? handleRefresh : undefined}
            isRefreshing={isPending}
            isNavigationDisabled={isNavigationDisabled}
        />
    );
}

/**
 * Pure presentational component.
 * Use HolidaysCardWithRefresh when you need refresh functionality from a Server Component.
 */
export function HolidaysCardComponent({
    holidays,
    onRefresh,
    isRefreshing = false,
    error,
    isNavigationDisabled = false,
}) {
    const isMobile = useIsMobile();

    // Get upcoming holidays from data
    const upcomingHolidays = holidays?.upcomingHolidays || [];

    if (error) {
        return (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Holidays
                </h3>
                <p className="text-sm text-destructive">{error}</p>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <CardTitle className={`${isMobile ? 'text-sm' : 'text-xl'}`}>
                    Upcoming Time Off
                </CardTitle>
                <div className="flex items-center gap-1">
                    {onRefresh && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className={isRefreshing ? 'animate-spin' : ''}
                        >
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                    {!isNavigationDisabled && (
                        <Link href={HOLIDAYS_ROUTE} className="md:block hover:cursor-pointer">
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-[var(--deploy-accent-lime)] transition-colors" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Holiday Stats */}
            {holidays && (
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--deploy-accent-lime)]">
                            {holidays.availableDays ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                    <div className="text-center border-x border-border/50">
                        <div className="text-2xl font-bold text-[var(--deploy-accent-orange)]">
                            {holidays.usedDays ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Used</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                            {holidays.totalDays ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {holidays && holidays.totalDays > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Holiday usage</span>
                        <span>{Math.round((holidays.usedDays / holidays.totalDays) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--deploy-accent-lime)] to-[var(--deploy-accent-yellow)] transition-all duration-500"
                            style={{ width: `${(holidays.usedDays / holidays.totalDays) * 100}%` }}
                        />
                    </div>
                    {holidays.nextResetDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Resets on {formatDateToEnUSWithOptions(holidays.nextResetDate)}
                        </p>
                    )}
                </div>
            )}

            {/* Upcoming Holidays List */}
            <div className="space-y-3">
                {upcomingHolidays.length > 0 ? (
                    upcomingHolidays.slice(0, 3).map((holiday, index) => (
                        <div
                            key={index}
                            className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-border transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-medium text-sm">
                                        {holiday.name || 'Time Off'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {holiday.date && formatDateToEnUSWithOptions(holiday.date)}
                                        {holiday.endDate && holiday.days > 1 && (
                                            <> - {formatDateToEnUSWithOptions(holiday.endDate)}</>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs font-medium text-[var(--deploy-accent-lime)]">
                                    {holiday.days || 1} day{(holiday.days || 1) !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        No upcoming time off scheduled
                    </div>
                )}
            </div>
        </Card>
    );
}
