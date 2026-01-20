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
import {
    chartConfig,
    OCCUPANCY_LEVELS,
    getOccupancyLevel,
    OccupancyTooltip,
    MetricsSummary,
} from './occupancy-chart-shared';

export function OccupancyChartPhone({ filteredData, allData, timeRange, setTimeRange, timeLabel }) {
    return (
        <Card className="@container/card" variant="shadow">
            <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>{timeLabel.short}</CardDescription>
                <CardAction>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-36" size="sm" aria-label="Select time range">
                            <SelectValue placeholder="Current month" />
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

            <CardContent>
                {filteredData.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <AlertTriangle className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No data available</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <MetricsSummary
                            data={filteredData}
                            allData={allData}
                            timeRange={timeRange}
                        />

                        {/* Horizontal bar chart for mobile */}
                        <ChartContainer config={chartConfig} className="h-[180px] w-full">
                            <BarChart
                                accessibilityLayer
                                data={filteredData}
                                layout="vertical"
                                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                                barSize={24}
                            >
                                <defs>
                                    {OCCUPANCY_LEVELS.map((level, index) => (
                                        <linearGradient
                                            key={`gradient-${index}`}
                                            id={`gradient-mobile-${index}`}
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor={level.color}
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor={level.color}
                                                stopOpacity={1}
                                            />
                                        </linearGradient>
                                    ))}
                                </defs>

                                <CartesianGrid
                                    horizontal={false}
                                    strokeDasharray="3 3"
                                    className="stroke-border/30"
                                />

                                <XAxis
                                    type="number"
                                    domain={[0, 150]}
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={[0, 85, 120]}
                                    tickFormatter={(value) => `${value}%`}
                                    fontSize={10}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    width={35}
                                    fontSize={11}
                                />

                                <ChartTooltip
                                    cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                    content={<OccupancyTooltip />}
                                />

                                <ReferenceLine
                                    x={85}
                                    stroke="var(--muted-foreground)"
                                    strokeDasharray="3 3"
                                    strokeOpacity={0.5}
                                />

                                <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                                    {filteredData.map((entry, index) => {
                                        const level = getOccupancyLevel(entry.rate);
                                        const gradientIndex = OCCUPANCY_LEVELS.indexOf(level);
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#gradient-mobile-${gradientIndex})`}
                                            />
                                        );
                                    })}
                                    <LabelList
                                        position="right"
                                        offset={8}
                                        className="fill-foreground"
                                        fontSize={11}
                                        formatter={(value) => `${value}%`}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
