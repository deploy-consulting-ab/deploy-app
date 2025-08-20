'use client';

import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
    CardAction,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, ChevronRight, RefreshCw } from 'lucide-react';
import { ErrorDisplay } from '@/components/errors/error-display';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { formatDateToEnUSWithOptions } from '@/lib/utils';
import { HOLIDAYS_ROUTE } from '@/routes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

export function HolidayCard({
    holidays: initialHolidays,
    error: initialError,
    isNavigationDisabled,
    refreshAction,
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [holidays, setHolidays] = useState(initialHolidays);
    const [error, setError] = useState(initialError);
    const isMobile = useIsMobile();
    const router = useRouter();

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const freshData = await refreshAction();
            setHolidays(freshData); // Update the local state with fresh data
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCardClick = (e) => {
        // Only navigate if we're on mobile and the click wasn't on the refresh button
        if (isMobile && !isNavigationDisabled && !e.target.closest('button')) {
            router.push(HOLIDAYS_ROUTE);
        }
    };

    if (error) {
        return (
            <div>
                <ErrorDisplay error={error} />
            </div>
        );
    }

    const progressPercentage = (holidays.currentFiscalUsedHolidays / holidays.totalHolidays) * 100;

    return (
        <Card
            variant="shadow"
            className={`relative overflow-hidden ${
                !isNavigationDisabled && isMobile && 'md:hover:cursor-pointer'
            }`}
            onClick={handleCardClick}
        >
            <CardHeader className="border-b">
                <CardTitle>Holidays</CardTitle>
                <CardDescription>
                    Holidays are a great way to relax and recharge, they are sadly limited.
                </CardDescription>
                <CardAction>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`md:hover:cursor-pointer ${
                                isRefreshing ? 'animate-spin' : ''
                            }`}
                        >
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Refresh data</span>
                        </Button>

                        {!isNavigationDisabled && (
                            <Link href={HOLIDAYS_ROUTE} className="md:block">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        )}
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent className="py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Holiday Allowance
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{holidays.availableHolidays}</h3>
                            <p className="text-sm text-muted-foreground">
                                of {holidays.totalHolidays} days available
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">% taken this year</span>
                        <span className="font-medium">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                        Resets on {formatDateToEnUSWithOptions(holidays.nextResetDate)}
                    </p>
                </div>

                {holidays.recentHolidayPeriods.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Recent Holidays</p>
                        <div className="space-y-2">
                            {holidays.recentHolidayPeriods.map((holiday, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {formatDateToEnUSWithOptions(holiday.fromDate)} -{' '}
                                        {formatDateToEnUSWithOptions(holiday.toDate)}
                                    </span>
                                    <span className="font-medium">{holiday.days} days</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
