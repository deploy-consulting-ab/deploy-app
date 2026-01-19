'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const chartConfig = {
    rate: {
        label: 'Occupancy',
    },
};

// Occupancy thresholds and their colors
export const OCCUPANCY_LEVELS = [
    {
        min: 0,
        max: 85,
        label: 'Below Target',
        color: 'var(--occupancy-color-critical-low)',
    },
    {
        min: 85,
        max: 93,
        label: 'Target',
        color: 'var(--occupancy-color-target)',
    },
    {
        min: 93,
        max: 100,
        label: 'Optimal',
        color: 'var(--occupancy-color-optimal)',
    },
    {
        min: 100,
        max: 120,
        label: 'Full',
        color: 'var(--occupancy-color-full)',
    },
    {
        min: 120,
        max: Infinity,
        label: 'Over Capacity',
        color: 'var(--occupancy-color-critical-high)',
    },
];

export const getOccupancyLevel = (value) => {
    if (!value && value !== 0) return OCCUPANCY_LEVELS[0];
    const numValue = Number(value);
    return (
        OCCUPANCY_LEVELS.find((level) => numValue >= level.min && numValue < level.max) ||
        OCCUPANCY_LEVELS[0]
    );
};

// Custom tooltip component with modern styling
export function OccupancyTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    const level = getOccupancyLevel(data.rate);

    return (
        <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md p-3 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: level.color }}
                />
                <span className="font-medium text-foreground">{data.month}</span>
            </div>
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Occupancy</span>
                    <span className="font-mono font-semibold text-foreground">{data.rate}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span
                        className="text-sm font-medium px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: `color-mix(in oklch, ${level.color} 20%, transparent)`,
                            color: level.color,
                        }}
                    >
                        {level.label}
                    </span>
                </div>
            </div>
        </div>
    );
}

// Metrics summary component (inline)
export function MetricsSummary({ data }) {
    if (!data || data.length === 0) return null;

    const rates = data.map((d) => d.rate).filter((r) => r != null);
    const average =
        rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
    const highest = rates.length > 0 ? Math.max(...rates) : 0;
    const lowest = rates.length > 0 ? Math.min(...rates) : 0;
    const trend = rates.length >= 2 ? Math.round(rates[rates.length - 1] - rates[0]) : 0;

    const averageLevel = getOccupancyLevel(average);
    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-3 border-b border-border/30 mb-2">
            <div className="flex items-center gap-2">
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: averageLevel.color }}
                />
                <span className="text-xs text-muted-foreground">Avg</span>
                <span className="text-sm font-mono font-semibold">{average}%</span>
            </div>
            <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">High</span>
                <span className="text-sm font-mono font-medium">{highest}%</span>
            </div>
            <div className="flex items-center gap-2">
                <TrendingDown className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Low</span>
                <span className="text-sm font-mono font-medium">{lowest}%</span>
            </div>
            <div className="flex items-center gap-2">
                <TrendIcon
                    className="w-3 h-3"
                    style={{
                        color:
                            trend >= 0
                                ? 'var(--occupancy-color-optimal)'
                                : 'var(--occupancy-color-critical-low)',
                    }}
                />
                <span className="text-xs text-muted-foreground">Trend</span>
                <span
                    className="text-sm font-mono font-medium"
                    style={{
                        color:
                            trend >= 0
                                ? 'var(--occupancy-color-optimal)'
                                : 'var(--occupancy-color-critical-low)',
                    }}
                >
                    {trend > 0 ? '+' : ''}
                    {trend}%
                </span>
            </div>
        </div>
    );
}

// Legend component
export function OccupancyLegend() {
    const legendItems = [
        { label: '< 85%', color: 'var(--occupancy-color-critical-low)' },
        { label: '85-93%', color: 'var(--occupancy-color-target)' },
        { label: '93-100%', color: 'var(--occupancy-color-optimal)' },
        { label: '100-120%', color: 'var(--occupancy-color-full)' },
        { label: '> 120%', color: 'var(--occupancy-color-critical-high)' },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2">
            {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                    <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

// Helper to get time range label
export const getTimeRangeLabel = (timeRange) => {
    switch (timeRange) {
        case 'FY':
            return { full: 'Current fiscal year (Feb-Jan)', short: 'Current FY' };
        case 'PFY':
            return { full: 'Previous fiscal year (Feb-Jan)', short: 'Previous FY' };
        case 'LAST_THREE_MONTHS':
            return { full: 'Last 3 months', short: 'Last 3 months' };
        case 'LAST_MONTH':
            return { full: 'Last month', short: 'Last month' };
        default:
            return { full: 'Current month', short: 'Current month' };
    }
};
