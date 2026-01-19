'use client';

import * as React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ReferenceLine,
    XAxis,
    YAxis,
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { getFiscalYear, isInFiscalYear, getUTCToday } from '@/lib/utils';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { NoDataComponent } from '@/components/errors/no-data';

const chartConfig = {
    rate: {
        label: 'Occupancy',
    },
};

// Occupancy thresholds and their colors
const OCCUPANCY_LEVELS = [
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

const getOccupancyLevel = (value) => {
    if (!value && value !== 0) return OCCUPANCY_LEVELS[0];
    const numValue = Number(value);
    return (
        OCCUPANCY_LEVELS.find((level) => numValue >= level.min && numValue < level.max) ||
        OCCUPANCY_LEVELS[0]
    );
};

// Custom tooltip component with modern styling
function OccupancyTooltip({ active, payload }) {
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

// Compact metrics summary component
function MetricsSummary({ data }) {
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
function OccupancyLegend() {
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

export function OccupancyChartComponent({ chartData, error }) {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('CURRENT_MONTH');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('CURRENT_MONTH');
        }
    }, [isMobile]);

    if (error) {
        return (
            <Card className="@container/card h-[400px] sm:h-[calc(100vh-7rem)]" variant="shadow">
                <CardContent className="flex items-center justify-center h-full">
                    <ErrorDisplayComponent error={error} />
                </CardContent>
            </Card>
        );
    }

    if (!chartData) {
        return (
            <Card className="@container/card h-[400px] sm:h-[calc(100vh-7rem)]" variant="shadow">
                <CardContent className="flex items-center justify-center h-full">
                    <NoDataComponent text="No occupancy data found" />
                </CardContent>
            </Card>
        );
    }

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const currentDate = getUTCToday();

        if (timeRange === 'FY' || timeRange === 'PFY') {
            const currentFiscalYear = getFiscalYear(currentDate);
            const targetFiscalYear =
                timeRange === 'FY' ? currentFiscalYear : currentFiscalYear - 1;
            return isInFiscalYear(date, targetFiscalYear);
        } else if (timeRange === 'CURRENT_MONTH') {
            return (
                date.getUTCFullYear() === currentDate.getUTCFullYear() &&
                date.getUTCMonth() === currentDate.getUTCMonth()
            );
        } else if (timeRange === 'LAST_MONTH') {
            const lastMonth = new Date(
                Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1)
            );
            return (
                date.getUTCFullYear() === lastMonth.getUTCFullYear() &&
                date.getUTCMonth() === lastMonth.getUTCMonth()
            );
        } else if (timeRange === 'LAST_THREE_MONTHS') {
            const firstDayOfCurrentMonth = new Date(
                Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
            );
            const startDate = new Date(
                Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 3, 1)
            );
            return date >= startDate && date < firstDayOfCurrentMonth;
        }
        return true;
    });

    const getTimeRangeLabel = () => {
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

    const timeLabel = getTimeRangeLabel();

    return (
        <Card className="@container/card h-[400px] sm:h-[calc(100vh-7rem)]" variant="shadow">
            <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">{timeLabel.full}</span>
                    <span className="@[540px]/card:hidden">{timeLabel.short}</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="CURRENT_MONTH" className="hover:cursor-pointer">
                            Current month
                        </ToggleGroupItem>
                        <ToggleGroupItem value="LAST_MONTH" className="hover:cursor-pointer">
                            Last month
                        </ToggleGroupItem>
                        <ToggleGroupItem value="LAST_THREE_MONTHS" className="hover:cursor-pointer">
                            Last 3 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="FY" className="hover:cursor-pointer">
                            Current FY
                        </ToggleGroupItem>
                        <ToggleGroupItem value="PFY" className="hover:cursor-pointer">
                            Previous FY
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Current FY" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="CURRENT_MONTH">Current month</SelectItem>
                            <SelectItem value="LAST_MONTH">Last month</SelectItem>
                            <SelectItem value="LAST_THREE_MONTHS">Last 3 months</SelectItem>
                            <SelectItem value="FY">Current FY</SelectItem>
                            <SelectItem value="PFY">Previous FY</SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>

            <CardContent className="flex-1 h-[calc(100%-10rem)]">
                {filteredData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                No occupancy data for this period
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <MetricsSummary data={filteredData} />

                        <ChartContainer
                            config={chartConfig}
                            className="flex-1 w-full min-h-0"
                        >
                            <BarChart
                                accessibilityLayer
                                data={filteredData}
                                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                                barSize={(() => {
                                    if (filteredData.length <= 1) return isMobile ? 50 : 80;
                                    if (filteredData.length <= 3) return isMobile ? 40 : 100;
                                    if (filteredData.length >= 10) return isMobile ? 24 : 60;
                                    return isMobile ? 32 : 80;
                                })()}
                            >
                                <defs>
                                    {OCCUPANCY_LEVELS.map((level, index) => (
                                        <linearGradient
                                            key={`gradient-${index}`}
                                            id={`gradient-${index}`}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor={level.color}
                                                stopOpacity={1}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor={level.color}
                                                stopOpacity={0.6}
                                            />
                                        </linearGradient>
                                    ))}
                                </defs>

                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    className="stroke-border/50"
                                />

                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        return `${value.slice(0, 3)} ${value.slice(value.length - 4)}`;
                                    }}
                                />

                                <YAxis
                                    domain={[0, 150]}
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={[0, 50, 85, 100, 120, 150]}
                                    tickFormatter={(value) => `${value}%`}
                                    width={45}
                                />

                                <ChartTooltip
                                    cursor={{ fill: 'var(--muted)', opacity: 0.3, radius: 4 }}
                                    content={<OccupancyTooltip />}
                                />

                                <ReferenceLine
                                    y={85}
                                    stroke="var(--muted-foreground)"
                                    strokeDasharray="3 3"
                                    label={{
                                        value: 'Target (85%)',
                                        position: 'insideTopRight',
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 12,
                                    }}
                                />

                                <ReferenceLine
                                    y={120}
                                    stroke="var(--muted-foreground)"
                                    strokeDasharray="3 3"
                                    label={{
                                        value: 'Max',
                                        position: 'insideTopRight',
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 12,
                                    }}
                                />

                                <Bar
                                    dataKey="rate"
                                    radius={[6, 6, 0, 0]}
                                    className="drop-shadow-sm"
                                >
                                    {filteredData.map((entry, index) => {
                                        const level = getOccupancyLevel(entry.rate);
                                        const gradientIndex = OCCUPANCY_LEVELS.indexOf(level);
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#gradient-${gradientIndex})`}
                                                className="hover:opacity-90 transition-opacity cursor-pointer"
                                            />
                                        );
                                    })}
                                    {!isMobile && (
                                        <LabelList
                                            position="top"
                                            offset={8}
                                            className="fill-foreground"
                                            fontSize={12}
                                            formatter={(value) => `${value}%`}
                                        />
                                    )}
                                </Bar>
                            </BarChart>
                        </ChartContainer>

                        {!isMobile && <OccupancyLegend />}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
