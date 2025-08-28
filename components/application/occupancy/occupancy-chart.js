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

import { useIsMobile } from '@/hooks/use-mobile';
import { getFiscalYear, isInFiscalYear } from '@/lib/utils';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

const chartConfig = {
    rate: {
        label: 'Occupancy',
    },
};

const getOccupancyColor = (value) => {
    if (!value && value !== 0) return '#a1a1aa'; // fallback gray
    const numValue = Number(value);
    if (numValue > 120) return 'var(--occupancy-color-critical-high)'; // red for over 100%
    if (numValue >= 100) return 'var(--occupancy-color-full)'; // green for at/above target
    if (numValue >= 93) return 'var(--occupancy-color-optimal)'; // yellow for below target
    if (numValue >= 85) return 'var(--occupancy-color-target)'; // gray for too low
    return 'var(--occupancy-color-critical-low)'; // gray for too low
};

export function OccupancyChartComponent({ chartData, error }) {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('90d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('90d');
        }
    }, [isMobile]);

    if (error) {
        return (
            <div>
                <ErrorDisplayComponent error={error} />
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No occupancy data found</p>
            </div>
        );
    }

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const currentDate = new Date();

        if (timeRange === 'FY' || timeRange === 'PFY') {
            const currentFiscalYear = getFiscalYear(currentDate);
            const targetFiscalYear = timeRange === 'FY' ? currentFiscalYear : currentFiscalYear - 1;
            return isInFiscalYear(date, targetFiscalYear);
        } else if (timeRange === 'CURRENT_MONTH') {
            // Current month: same year and month as current date
            return (
                date.getFullYear() === currentDate.getFullYear() &&
                date.getMonth() === currentDate.getMonth()
            );
        } else if (timeRange === 'LAST_MONTH') {
            // Last month: get previous month
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            return (
                date.getFullYear() === lastMonth.getFullYear() &&
                date.getMonth() === lastMonth.getMonth()
            );
        } else if (timeRange === '90d') {
            // Last 3 months
            const startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate() - 90);
            return date >= startDate;
        }
        return true; // Default case: show all data
    });

    return (
        <Card className="@container/card h-[400px] sm:h-[calc(100vh-7rem)]" variant="shadow">
            <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>
                    {timeRange === 'FY' ? (
                        <>
                            <span className="hidden @[540px]/card:block">
                                Total for current fiscal year (Feb-Jan)
                            </span>
                            <span className="@[540px]/card:hidden">Current FY</span>
                        </>
                    ) : timeRange === 'PFY' ? (
                        <>
                            <span className="hidden @[540px]/card:block">
                                Total for previous fiscal year (Feb-Jan)
                            </span>
                            <span className="@[540px]/card:hidden">Previous FY</span>
                        </>
                    ) : (
                        <>
                            <span className="hidden @[540px]/card:block">
                                Total for the{' '}
                                {timeRange === '90d'
                                    ? 'last 3 months'
                                    : timeRange === 'LAST_MONTH'
                                    ? 'last month'
                                    : 'current month'}
                            </span>
                            <span className="@[540px]/card:hidden">
                                {timeRange === '90d'
                                    ? 'Last 3 months'
                                    : timeRange === 'LAST_MONTH'
                                    ? 'Last month'
                                    : 'Current month'}
                            </span>
                        </>
                    )}
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value="FY">Current FY</ToggleGroupItem>
                        <ToggleGroupItem value="PFY">Previous FY</ToggleGroupItem>
                        <ToggleGroupItem value="CURRENT_MONTH">Current month</ToggleGroupItem>
                        <ToggleGroupItem value="LAST_MONTH">Last month</ToggleGroupItem>
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
                            <SelectItem value="FY" className="rounded-lg">
                                Current FY
                            </SelectItem>
                            <SelectItem value="PFY" className="rounded-lg">
                                Previous FY
                            </SelectItem>
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="CURRENT_MONTH" className="rounded-lg">
                                Current month
                            </SelectItem>
                            <SelectItem value="LAST_MONTH" className="rounded-lg">
                                Last month
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 h-[calc(100%-12rem)]">
                <ChartContainer config={chartConfig} className="h-[calc(100%-2rem)] w-full">
                    <BarChart 
                        accessibilityLayer 
                        data={filteredData}
                        barSize={(() => {
                            // Dynamic bar size based on number of bars
                            if (filteredData.length <= 1) return isMobile ? 40 : 80; // Single bar
                            if (filteredData.length <= 3) return isMobile ? 30 : 100; // Few bars (quarterly)
                            if (filteredData.length >= 10) return isMobile ? 20 : 80; // More than 10
                            return isMobile ? 30 : 100; // Many bars but less than 10
                        })()}
                    >
                        <CartesianGrid vertical={false} />
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
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value) => 'Occupancy: ' + value + '%'}
                                />
                            }
                        />
                        <Bar dataKey="rate" radius={8}>
                            {filteredData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getOccupancyColor(entry.rate)}
                                />
                            ))}
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
            </CardContent>
        </Card>
    );
}
