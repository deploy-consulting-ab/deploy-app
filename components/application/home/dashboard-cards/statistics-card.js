'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';
import { useIsMobile } from '@/hooks/use-mobile';

export function StatisticsCardComponent({
    stats = [],
    title = 'Assignments',
    refreshAction,
    error: initialError,
}) {
    const isMobile = useIsMobile();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statsData, setStatsData] = useState(stats);
    const [error, setError] = useState(initialError);

    const handleRefresh = async () => {
        if (isRefreshing || !refreshAction) return;
        setIsRefreshing(true);
        try {
            const freshData = await refreshAction();
            setStatsData(freshData);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to refresh statistics');
        } finally {
            setIsRefreshing(false);
        }
    };

    // Color mapping for different stat types
    const getStatColor = (label) => {
        const lowerLabel = label?.toLowerCase() || '';
        if (lowerLabel.includes('active')) return 'var(--accent-yellow)';
        if (lowerLabel.includes('proposed')) return 'var(--accent-orange)';
        if (lowerLabel.includes('closed')) return 'var(--accent-lime)';
        return 'var(--accent-blue-bright)';
    };

    // Map label to view filter parameter
    const getViewFilter = (label) => {
        const lowerLabel = label?.toLowerCase() || '';
        if (lowerLabel.includes('all')) return 'all';
        if (lowerLabel.includes('active') || lowerLabel.includes('ongoing')) return 'ongoing';
        if (lowerLabel.includes('closed') || lowerLabel.includes('completed')) return 'completed';
        if (lowerLabel.includes('proposed') || lowerLabel.includes('not started'))
            return 'not started';
        return 'all';
    };

    // Generate mock chart data for each stat
    const generateChartData = (value) => {
        const base = value || 1;
        return [
            Math.max(0, base - 2),
            Math.max(0, base - 1),
            base,
            Math.max(0, base + 1),
            base,
            Math.max(0, base - 1),
            base,
        ];
    };

    if (error) {
        return (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
                <p className="text-sm text-destructive">{error}</p>
            </Card>
        );
    }

    if (!statsData || statsData.length === 0) {
        return (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
                <p className="text-sm text-muted-foreground">No statistics available</p>
            </Card>
        );
    }

    return (
        <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between">
                <CardTitle className={`${isMobile ? 'text-sm' : 'text-xl'}`}>{title}</CardTitle>
                <div className="flex items-center gap-2">
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
                </div>
            </div>

            {/* Assignment Stats Cards with Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border/50">
                {statsData.map((stat, index) => {
                    const viewFilter = getViewFilter(stat.label);
                    const href = `${ASSIGNMENTS_ROUTE}?view=${viewFilter}`;

                    return (
                        <Link key={stat.id || index} href={href}>
                            <Card className="p-4 border-border/50 hover:shadow-lg hover:border-[var(--accent-lime)]/50 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[var(--accent-lime)] transition-colors" />
                                </div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </Card>
    );
}
