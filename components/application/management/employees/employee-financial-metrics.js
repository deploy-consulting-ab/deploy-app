'use client';

import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    EMPLOYEE_FINANCIAL_TOOLTIPS,
    MetricCell,
} from '@/components/application/management/employees/employee-financial-metric-ui';

export function MetricField({ label, value, description }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-1.5">
                <p className="text-muted-foreground font-semibold text-xs uppercase">{label}</p>
                {description && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex cursor-help text-muted-foreground/60 hover:text-muted-foreground"
                                aria-label={`About ${label}`}
                            >
                                <Info className="size-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                            {description}
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <p className="font-medium">{value ?? '—'}</p>
        </div>
    );
}

function buildMetricColumns({
    adjustedCostFY,
    adjustedCostFYTD,
    projectedAmountFY,
    invoicedAmount,
    projectedProfitabilityFY,
    profitabilityFY,
    profitabilityFYTD,
}) {
    return [
        {
            title: 'Projected',
            metrics: [
                {
                    label: 'Proj. Invoiced FY',
                    value: projectedAmountFY,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.projectedInvoicedFY,
                },
                {
                    label: 'Cost FY',
                    value: adjustedCostFY,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.adjustedCostFY,
                },
                {
                    label: 'Proj. Prof. FY',
                    value: projectedProfitabilityFY,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.projectedProfitabilityFY,
                    colored: true,
                },
            ],
        },
        {
            title: 'Full Year',
            metrics: [
                {
                    label: 'Invoiced FY',
                    value: invoicedAmount,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.invoicedAmount,
                },
                {
                    label: 'Cost FY',
                    value: adjustedCostFY,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.adjustedCostFY,
                },
                {
                    label: 'Profit FY',
                    value: profitabilityFY,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.profitabilityFY,
                    colored: true,
                },
            ],
        },
        {
            title: 'FYTD',
            metrics: [
                {
                    label: 'Invoiced FY',
                    value: invoicedAmount,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.invoicedAmount,
                },
                {
                    label: 'Cost FYTD',
                    value: adjustedCostFYTD,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.adjustedCostFYTD,
                },
                {
                    label: 'Profit FYTD',
                    value: profitabilityFYTD,
                    description: EMPLOYEE_FINANCIAL_TOOLTIPS.profitabilityFYTD,
                    colored: true,
                },
            ],
        },
    ];
}

function EmployeeFinancialMetricsMobile({ columns }) {
    return (
        <div className="flex flex-col gap-3 md:hidden">
            {columns.map((column, index) => (
                <div
                    key={column.title}
                    className={index > 0 ? 'pt-3 border-t border-border/50' : undefined}
                >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                        {column.title}
                    </p>
                    <div className="space-y-2">
                        {column.metrics.map((metric) => (
                            <MetricCell key={metric.label} layout="row" {...metric} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmployeeFinancialMetricsDesktop({ columns }) {
    const rowLabels = ['Invoiced', 'Cost', 'Profit'];

    return (
        <div className="hidden md:grid min-w-0 grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 gap-y-2.5 items-end">
            <div />
            {columns.map((column) => (
                <span
                    key={column.title}
                    className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 pb-1 border-b border-border/50"
                >
                    {column.title}
                </span>
            ))}

            {rowLabels.map((rowLabel, rowIndex) => (
                <div key={rowLabel} className="contents">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 leading-tight self-center">
                        {rowLabel}
                    </span>
                    {columns.map((column) => {
                        const metric = column.metrics[rowIndex];

                        return (
                            <MetricCell
                                key={`${column.title}-${metric.label}`}
                                label={metric.label}
                                value={metric.value}
                                description={metric.description}
                                colored={metric.colored}
                                hideLabel
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export function EmployeeFinancialMetrics(props) {
    const columns = buildMetricColumns(props);

    return (
        <>
            <EmployeeFinancialMetricsMobile columns={columns} />
            <EmployeeFinancialMetricsDesktop columns={columns} />
        </>
    );
}
