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
import { AlertTriangle } from 'lucide-react';

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
import {
    chartConfig,
    OCCUPANCY_LEVELS,
    getOccupancyLevel,
    OccupancyTooltip,
    MetricsSummary,
    OccupancyLegend,
    getTimeRangeLabel,
} from './occupancy-chart-shared';
import { OccupancyChartPhone } from './occupancy-chart-phone';

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

    const timeLabel = getTimeRangeLabel(timeRange);

    // Mobile view
    if (isMobile) {
        return (
            <OccupancyChartPhone
                filteredData={filteredData}
                allData={chartData}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                timeLabel={timeLabel}
            />
        );
    }

    // Desktop view
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
                        onValueChange={(value) => value && setTimeRange(value)}
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
                        <MetricsSummary
                            data={filteredData}
                            allData={chartData}
                            timeRange={timeRange}
                        />

                        <ChartContainer
                            config={chartConfig}
                            className="flex-1 w-full min-h-0"
                        >
                            <BarChart
                                accessibilityLayer
                                data={filteredData}
                                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                                barSize={(() => {
                                    if (filteredData.length <= 1) return 80;
                                    if (filteredData.length <= 3) return 100;
                                    if (filteredData.length >= 10) return 60;
                                    return 80;
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
                                    <LabelList
                                        position="top"
                                        offset={8}
                                        className="fill-foreground"
                                        fontSize={12}
                                        formatter={(value) => `${value}%`}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>

                        <OccupancyLegend />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
