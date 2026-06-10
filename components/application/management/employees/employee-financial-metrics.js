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

export function EmployeeFinancialMetrics({
    adjustedCostFY,
    projectedAmountFY,
    invoicedAmount,
    projectedProfitabilityFY,
    profitabilityFY,
    profitabilityFYTD,
}) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <MetricCell
                    label="Proj. Invoiced FY"
                    value={projectedAmountFY}
                    description={EMPLOYEE_FINANCIAL_TOOLTIPS.projectedInvoicedFY}
                />
                <MetricCell
                    label="Invoiced FY"
                    value={invoicedAmount}
                    description={EMPLOYEE_FINANCIAL_TOOLTIPS.invoicedAmount}
                />
                <MetricCell
                    label="Cost FY"
                    value={adjustedCostFY}
                    description={EMPLOYEE_FINANCIAL_TOOLTIPS.adjustedCostFY}
                />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                <MetricCell
                    label="Proj. Prof. FY"
                    value={projectedProfitabilityFY}
                    description={EMPLOYEE_FINANCIAL_TOOLTIPS.projectedProfitabilityFY}
                    colored
                />
                <MetricCell
                    label="Profit FY"
                    value={profitabilityFY}
                    description={EMPLOYEE_FINANCIAL_TOOLTIPS.profitabilityFY}
                    colored
                />
                <MetricCell
                    label="Profit FYTD"
                    value={profitabilityFYTD}
                    description={EMPLOYEE_FINANCIAL_TOOLTIPS.profitabilityFYTD}
                    colored
                />
            </div>
        </div>
    );
}
