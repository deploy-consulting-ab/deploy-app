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
import { Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { OCCUPANCY_ROUTE } from '@/routes';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { NoDataComponent } from '@/components/errors/no-data';

export function OccupancyCard({
    occupancy,
    refreshAction,
    isNavigationDisabled,
    error: initialError,
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [occupancyData, setOccupancyData] = useState(occupancy);
    const [error, setError] = useState(initialError);

    if (error) {
        return (
            <div>
                <ErrorDisplayComponent error={error} />
            </div>
        );
    }

    if (!occupancyData) {
        return <NoDataComponent text="No occupancy data found" />;
    }

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const freshData = await refreshAction();
            setOccupancyData(freshData); // Update the local state with fresh data
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const isIncreasing = occupancyData.history[0].rate <= occupancyData.current;

    return (
        <Card className="relative overflow-hidden" variant="shadow">
            <CardHeader className="border-b">
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>How busy have you been this month?</CardDescription>
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
                            <Link href={OCCUPANCY_ROUTE} className="md:block">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        )}
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold">{occupancyData.current}%</h3>
                            <span
                                className={`flex items-center text-sm  ${
                                    isIncreasing ? 'text-green-600' : 'text-red-400'
                                }`}
                            >
                                <TrendingUp
                                    className={`h-4 w-4 ${!isIncreasing && 'rotate-180'}`}
                                />
                                vs last month
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                    </div>
                    <Progress value={occupancyData.current} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Target: 85%</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Monthly History</p>
                    <div className="space-y-2">
                        {occupancyData.history.map((month, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{month.month}</span>
                                <span className="font-medium">{month.rate}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
