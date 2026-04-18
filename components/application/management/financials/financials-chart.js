'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import { formatSEK } from '@/lib/utils';
import { NoDataComponent } from '@/components/errors/no-data';

const CHART_CONFIG = {
    revenue: { label: 'Revenue', color: '#3b82f6' },
    cost: { label: 'Cost', color: '#ef4444' },
    benefit: { label: 'Benefit', color: '#22c55e' },
    taxes: { label: 'Taxes', color: '#fddA0d' },
};

const QUARTER_LABELS = {
    0: 'Total Year',
    1: 'Q1',
    2: 'Q2',
    3: 'Q3',
    4: 'Q4',
};

/**
 * Bar chart: Revenue / Cost / Benefit / Taxes grouped by quarter for the selected FY.
 */
export function FinancialsBarChartComponent({ records, fiscalYear }) {
    const quarterRecords = records
        .filter((r) => r.fiscalYear === fiscalYear && r.quarter >= 1 && r.quarter <= 4)
        .sort((a, b) => a.quarter - b.quarter)
        .map((r) => ({
            quarter: QUARTER_LABELS[r.quarter],
            revenue: r.revenue,
            cost: r.cost,
            benefit: r.benefit,
        }));

    return (
        <Card variant="shadow">
            <CardHeader>
                <CardTitle>Quarterly Breakdown</CardTitle>
                <CardDescription>
                    Revenue, Cost, Benefit and Taxes for FY {fiscalYear}/
                    {String(fiscalYear + 1).slice(-2)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {quarterRecords.length === 0 ? (
                    <div className="flex items-center justify-center h-48">
                        <NoDataComponent text="No quarterly data for this fiscal year" />
                    </div>
                ) : (
                    <ChartContainer config={CHART_CONFIG} className="w-full h-72">
                        <BarChart
                            data={quarterRecords}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-border/50"
                            />
                            <XAxis
                                dataKey="quarter"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => formatSEK(v)}
                                width={90}
                            />
                            <ChartTooltip
                                cursor={{ fill: 'var(--muted)', opacity: 0.3, radius: 4 }}
                                content={
                                    <ChartTooltipContent
                                        className="text-sm"
                                        formatter={(value, name, item) => (
                                            <>
                                                <span
                                                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <div className="flex flex-1 justify-between leading-none items-center">
                                                    <span className="text-muted-foreground">
                                                        {CHART_CONFIG[name]?.label || name}
                                                    </span>
                                                    <span className="font-mono font-medium tabular-nums ml-2">
                                                        {formatSEK(value)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                                dataKey="revenue"
                                fill="var(--color-revenue)"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
                            <Bar
                                dataKey="benefit"
                                fill="var(--color-benefit)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Line chart: Revenue / Cost / Benefit / Taxes trend across fiscal years (Total Year records).
 */
export function FinancialsLineChartComponent({ records }) {
    const totalYearRecords = records
        .filter((r) => r.quarter === 0)
        .sort((a, b) => a.fiscalYear - b.fiscalYear)
        .map((r) => ({
            fy: `FY ${r.fiscalYear}/${String(r.fiscalYear + 1).slice(-2)}`,
            revenue: r.revenue,
            cost: r.cost,
            benefit: r.benefit,
            taxes: r.taxes,
        }));

    return (
        <Card variant="shadow">
            <CardHeader>
                <CardTitle>Annual Trend</CardTitle>
                <CardDescription>
                    Revenue, Cost, Benefit and Taxes across fiscal years (Total Year)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {totalYearRecords.length === 0 ? (
                    <div className="flex items-center justify-center h-48">
                        <NoDataComponent text="No Total Year records available yet" />
                    </div>
                ) : (
                    <ChartContainer config={CHART_CONFIG} className="w-full h-72">
                        <LineChart
                            data={totalYearRecords}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-border/50"
                            />
                            <XAxis dataKey="fy" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => formatSEK(v)}
                                width={90}
                            />
                            <ChartTooltip
                                className="text-sm"
                                cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1 }}
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name, item) => (
                                            <>
                                                <span
                                                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <div className="flex flex-1 justify-between leading-none items-center">
                                                    <span className="text-muted-foreground">
                                                        {CHART_CONFIG[name]?.label || name}
                                                    </span>
                                                    <span className="font-mono font-medium tabular-nums ml-2">
                                                        {formatSEK(value)}
                                                    </span>
                                                </div>
                                            </>
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
                                dataKey="benefit"
                                stroke="var(--color-benefit)"
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
                )}
            </CardContent>
        </Card>
    );
}
