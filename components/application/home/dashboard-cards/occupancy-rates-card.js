'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProgressRing } from '@/components/application/home/progress-ring';
import { MiniLineChart } from '@/components/application/home/mini-chart';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';
import { OCCUPANCY_ROUTE } from '@/menus/routes';

export function OccupancyRatesCardComponent({
    occupancy: initialOccupancy,
    error: initialError,
    refreshAction,
    target = 85,
}) {
    const isMobile = useIsMobile();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [occupancy, setOccupancy] = useState(initialOccupancy);
    const [error, setError] = useState(initialError);

    const handleRefresh = async () => {
        if (isRefreshing || !refreshAction) return;
        setIsRefreshing(true);
        try {
            const freshData = await refreshAction();
            setOccupancy(freshData);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to refresh occupancy data');
        } finally {
            setIsRefreshing(false);
        }
    };

    const currentRate = occupancy?.currentRate ?? 0;
    const history = occupancy?.history ?? [];

    // Get current month name
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Generate chart data and labels from history or use current rate
    const chartData =
        history.length > 0
            ? history.map((h) => h.rate).reverse()
            : [currentRate, currentRate, currentRate, currentRate, currentRate];
    
    const chartLabels =
        history.length > 0
            ? history.map((h) => h.period).reverse()
            : [currentMonth, currentMonth, currentMonth, currentMonth, currentMonth];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between">
                <CardTitle className={`${isMobile ? 'text-sm' : 'text-xl'}`}>
                    Occupancy Rate
                </CardTitle>
                <div className="flex items-center gap-1">
                    {refreshAction && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={isRefreshing ? 'animate-spin' : ''}
                        >
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                    <Link href={OCCUPANCY_ROUTE} className="md:block hover:cursor-pointer">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-[var(--deploy-accent-lime)] transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center justify-center py-2">
                <ProgressRing progress={currentRate} size={140} color="var(--deploy-accent-lime)">
                    <div className="text-center">
                        <div className="text-4xl font-bold">{currentRate}%</div>
                        <div className="text-sm text-muted-foreground mt-1">{currentMonth}</div>
                    </div>
                </ProgressRing>
            </div>

            <p className="text-sm text-muted-foreground text-center">
                Target is {target}% utilization
            </p>

            {/* Mini Chart */}
            {chartData.length > 1 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Recent Trend</p>
                    <div className="h-16">
                        <MiniLineChart data={chartData} labels={chartLabels} color="var(--deploy-accent-lime)" />
                    </div>
                </div>
            )}

            {/* History List */}
            {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-md font-medium text-muted-foreground mb-2">
                        Monthly History
                    </p>
                    <div className="space-y-2">
                        {history.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{item.period}</span>
                                <span className="font-medium">{item.rate}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
