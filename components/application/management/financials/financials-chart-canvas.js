'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import { formatSEK, formatSEKCompact } from '@/lib/utils';

function TooltipValue({ value, name, item, chartConfig }) {
    return (
        <>
            <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-1 justify-between leading-none items-center">
                <span className="text-muted-foreground">{chartConfig[name]?.label || name}</span>
                <span className="font-mono font-medium tabular-nums ml-2">{formatSEK(value)}</span>
            </div>
        </>
    );
}

export function FinancialsBarChartCanvas({ data, compact, chartConfig }) {
    const yTickFormatter = compact ? formatSEKCompact : formatSEK;
    const yWidth = compact ? 60 : 90;

    return (
        <ChartContainer config={chartConfig} className="w-full h-72">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                />
                <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={yTickFormatter}
                    width={yWidth}
                />
                <ChartTooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.3, radius: 4 }}
                    content={
                        <ChartTooltipContent
                            className="text-sm"
                            formatter={(value, name, item) => (
                                <TooltipValue
                                    value={value}
                                    name={name}
                                    item={item}
                                    chartConfig={chartConfig}
                                />
                            )}
                        />
                    }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={80}
                />
                <Bar
                    dataKey="cost"
                    fill="var(--color-cost)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={80}
                />
                <Bar
                    dataKey="profit"
                    fill="var(--color-profit)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={80}
                />
            </BarChart>
        </ChartContainer>
    );
}

export function FinancialsQuarterComparisonChartCanvas({ data, compact, chartConfig }) {
    const yTickFormatter = compact ? formatSEKCompact : formatSEK;
    const yWidth = compact ? 68 : 90;

    return (
        <ChartContainer config={chartConfig} className="w-full h-72">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                />
                <XAxis dataKey="fy" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={yTickFormatter}
                    width={yWidth}
                />
                <ChartTooltip
                    className="text-sm"
                    cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, item) => (
                                <TooltipValue
                                    value={value}
                                    name={name}
                                    item={item}
                                    chartConfig={chartConfig}
                                />
                            )}
                        />
                    }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="var(--color-cost)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="taxes"
                    stroke="var(--color-taxes)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ChartContainer>
    );
}

export function FinancialsLineChartCanvas({ data, compact, chartConfig }) {
    const yTickFormatter = compact ? formatSEKCompact : formatSEK;
    const yWidth = compact ? 68 : 90;

    return (
        <ChartContainer config={chartConfig} className="w-full h-72">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                />
                <XAxis dataKey="fy" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={yTickFormatter}
                    width={yWidth}
                />
                <ChartTooltip
                    className="text-sm"
                    cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, item) => (
                                <TooltipValue
                                    value={value}
                                    name={name}
                                    item={item}
                                    chartConfig={chartConfig}
                                />
                            )}
                        />
                    }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="var(--color-cost)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="taxes"
                    stroke="var(--color-taxes)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ChartContainer>
    );
}
