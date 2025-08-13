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
    ChartConfig,
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

export const description = 'An interactive area chart';

const chartDataOld = [
    { date: '2024-04-01', desktop: 222, mobile: 150 },
    { date: '2024-04-02', desktop: 97, mobile: 180 },
    { date: '2024-04-03', desktop: 167, mobile: 120 },
    { date: '2024-04-04', desktop: 242, mobile: 260 },
    { date: '2024-04-05', desktop: 373, mobile: 290 },
    { date: '2024-04-06', desktop: 301, mobile: 340 },
    { date: '2024-04-07', desktop: 245, mobile: 180 },
    { date: '2024-04-08', desktop: 409, mobile: 320 },
    { date: '2024-04-09', desktop: 59, mobile: 110 },
    { date: '2024-04-10', desktop: 261, mobile: 190 },
    { date: '2024-04-11', desktop: 327, mobile: 350 },
    { date: '2024-04-12', desktop: 292, mobile: 210 },
    { date: '2024-04-13', desktop: 342, mobile: 380 },
    { date: '2024-04-14', desktop: 137, mobile: 220 },
    { date: '2024-04-15', desktop: 120, mobile: 170 },
    { date: '2024-04-16', desktop: 138, mobile: 190 },
    { date: '2024-04-17', desktop: 446, mobile: 360 },
    { date: '2024-04-18', desktop: 364, mobile: 410 },
    { date: '2024-04-19', desktop: 243, mobile: 180 },
    { date: '2024-04-20', desktop: 89, mobile: 150 },
    { date: '2024-04-21', desktop: 137, mobile: 200 },
    { date: '2024-04-22', desktop: 224, mobile: 170 },
    { date: '2024-04-23', desktop: 138, mobile: 230 },
    { date: '2024-04-24', desktop: 387, mobile: 290 },
    { date: '2024-04-25', desktop: 215, mobile: 250 },
    { date: '2024-04-26', desktop: 75, mobile: 130 },
    { date: '2024-04-27', desktop: 383, mobile: 420 },
    { date: '2024-04-28', desktop: 122, mobile: 180 },
    { date: '2024-04-29', desktop: 315, mobile: 240 },
    { date: '2024-04-30', desktop: 454, mobile: 380 },
    { date: '2024-05-01', desktop: 165, mobile: 220 },
    { date: '2024-05-02', desktop: 293, mobile: 310 },
    { date: '2024-05-03', desktop: 247, mobile: 190 },
    { date: '2024-05-04', desktop: 385, mobile: 420 },
    { date: '2024-05-05', desktop: 481, mobile: 390 },
    { date: '2024-05-06', desktop: 498, mobile: 520 },
    { date: '2024-05-07', desktop: 388, mobile: 300 },
    { date: '2024-05-08', desktop: 149, mobile: 210 },
    { date: '2024-05-09', desktop: 227, mobile: 180 },
    { date: '2024-05-10', desktop: 293, mobile: 330 },
    { date: '2024-05-11', desktop: 335, mobile: 270 },
    { date: '2024-05-12', desktop: 197, mobile: 240 },
    { date: '2024-05-13', desktop: 197, mobile: 160 },
    { date: '2024-05-14', desktop: 448, mobile: 490 },
    { date: '2024-05-15', desktop: 473, mobile: 380 },
    { date: '2024-05-16', desktop: 338, mobile: 400 },
    { date: '2024-05-17', desktop: 499, mobile: 420 },
    { date: '2024-05-18', desktop: 315, mobile: 350 },
    { date: '2024-05-19', desktop: 235, mobile: 180 },
    { date: '2024-05-20', desktop: 177, mobile: 230 },
    { date: '2024-05-21', desktop: 82, mobile: 140 },
    { date: '2024-05-22', desktop: 81, mobile: 120 },
    { date: '2024-05-23', desktop: 252, mobile: 290 },
    { date: '2024-05-24', desktop: 294, mobile: 220 },
    { date: '2024-05-25', desktop: 201, mobile: 250 },
    { date: '2024-05-26', desktop: 213, mobile: 170 },
    { date: '2024-05-27', desktop: 420, mobile: 460 },
    { date: '2024-05-28', desktop: 233, mobile: 190 },
    { date: '2024-05-29', desktop: 78, mobile: 130 },
    { date: '2024-05-30', desktop: 340, mobile: 280 },
    { date: '2024-05-31', desktop: 178, mobile: 230 },
    { date: '2024-06-01', desktop: 178, mobile: 200 },
    { date: '2024-06-02', desktop: 470, mobile: 410 },
    { date: '2024-06-03', desktop: 103, mobile: 160 },
    { date: '2024-06-04', desktop: 439, mobile: 380 },
    { date: '2024-06-05', desktop: 88, mobile: 140 },
    { date: '2024-06-06', desktop: 294, mobile: 250 },
    { date: '2024-06-07', desktop: 323, mobile: 370 },
    { date: '2024-06-08', desktop: 385, mobile: 320 },
    { date: '2024-06-09', desktop: 438, mobile: 480 },
    { date: '2024-06-10', desktop: 155, mobile: 200 },
    { date: '2024-06-11', desktop: 92, mobile: 150 },
    { date: '2024-06-12', desktop: 492, mobile: 420 },
    { date: '2024-06-13', desktop: 81, mobile: 130 },
    { date: '2024-06-14', desktop: 426, mobile: 380 },
    { date: '2024-06-15', desktop: 307, mobile: 350 },
    { date: '2024-06-16', desktop: 371, mobile: 310 },
    { date: '2024-06-17', desktop: 475, mobile: 520 },
    { date: '2024-06-18', desktop: 107, mobile: 170 },
    { date: '2024-06-19', desktop: 341, mobile: 290 },
    { date: '2024-06-20', desktop: 408, mobile: 450 },
    { date: '2024-06-21', desktop: 169, mobile: 210 },
    { date: '2024-06-22', desktop: 317, mobile: 270 },
    { date: '2024-06-23', desktop: 480, mobile: 530 },
    { date: '2024-06-24', desktop: 132, mobile: 180 },
    { date: '2024-06-25', desktop: 141, mobile: 190 },
    { date: '2024-06-26', desktop: 434, mobile: 380 },
    { date: '2024-06-27', desktop: 448, mobile: 490 },
    { date: '2024-06-28', desktop: 149, mobile: 200 },
    { date: '2024-06-29', desktop: 103, mobile: 160 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
];

const chartData = [
    { month: 'January 2024', date: '2024-01-01', occupancy: 86 },
    { month: 'February 2024', date: '2024-02-01', occupancy: 95 },
    { month: 'March 2024', date: '2024-03-01', occupancy: 87 },
    { month: 'April 2024', date: '2024-04-01', occupancy: 73 },
    { month: 'May 2024', date: '2024-05-01', occupancy: 89 },
    { month: 'June 2024', date: '2024-06-01', occupancy: 84 },
    { month: 'July 2024', date: '2024-07-01', occupancy: 85 },
    { month: 'August 2024', date: '2024-08-01', occupancy: 88 },
    { month: 'September 2024', date: '2024-09-01', occupancy: 92 },
    { month: 'October 2024', date: '2024-10-01', occupancy: 89 },
    { month: 'November 2024', date: '2024-11-01', occupancy: 87 },
    { month: 'December 2024', date: '2024-12-01', occupancy: 88 },
    { month: 'January 2025', date: '2025-01-01', occupancy: 86 },
    { month: 'February 2025', date: '2025-02-01', occupancy: 95 },
    { month: 'March 2025', date: '2025-03-01', occupancy: 87 },
    { month: 'April 2025', date: '2025-04-01', occupancy: 93 },
    { month: 'May 2025', date: '2025-05-01', occupancy: 89 },
    { month: 'June 2025', date: '2025-06-01', occupancy: 94 },
    { month: 'July 2025', date: '2025-07-01', occupancy: 127 },
    { month: 'August 2025', date: '2025-08-01', occupancy: 30 },
];

const chartConfig = {
    occupancy: {
        label: 'Occupancy',
        // color: 'var(--primary)',
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

export function OccupancyChartComponent() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('90d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('90d');
        }
    }, [isMobile]);

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
                        <Bar dataKey="occupancy" radius={8}>
                            {filteredData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getOccupancyColor(entry.occupancy)}
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
