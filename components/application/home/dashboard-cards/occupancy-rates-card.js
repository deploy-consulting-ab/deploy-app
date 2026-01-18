'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProgressRing } from '@/components/application/home/progress-ring';
import { MiniLineChart } from '@/components/application/home/mini-chart';

export function OccupancyRatesCard({
    occupancy: initialOccupancy,
    error: initialError,
    refreshAction,
    target = 85,
}) {
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
    const previousRate = occupancy?.previousRate ?? null;
    const history = occupancy?.history ?? [];

    // Calculate trend
    const isIncreasing = previousRate !== null ? currentRate >= previousRate : true;
    const changeAmount =
        previousRate !== null ? Math.abs(currentRate - previousRate).toFixed(1) : null;

    // Generate chart data from history or use current rate
    const chartData =
        history.length > 0
            ? history.map((h) => h.rate).reverse()
            : [currentRate, currentRate, currentRate, currentRate, currentRate];

    if (error) {
        return (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4">Occupancy Rate</h3>
                <p className="text-sm text-destructive">{error}</p>
            </Card>
        );
    }

    return (
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Team Capacity</h3>
                {refreshAction && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`h-7 w-7 ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                )}
            </div>

            {/* Progress Ring */}
            <div className="flex items-center justify-center py-2">
                <ProgressRing progress={currentRate} size={100} color="var(--accent-lime)">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{currentRate}%</div>
                    </div>
                </ProgressRing>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
                Target is {target}% utilization
            </p>

            {/* Mini Chart */}
            {chartData.length > 1 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-1.5">Recent Trend</p>
                    <div className="h-12">
                        <MiniLineChart data={chartData} color="var(--accent-lime)" />
                    </div>
                </div>
            )}

            {/* History List */}
            {history.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        Monthly History
                    </p>
                    <div className="space-y-1">
                        {history.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between text-xs">
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
