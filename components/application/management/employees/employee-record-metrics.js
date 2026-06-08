'use client';

import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { CardTitle } from '@/components/ui/card';

function MetricField({ label, value, description }) {
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

function MetricSection({ title, children }) {
    return (
        <section className="space-y-3">
            <CardTitle className="text-base">{title}</CardTitle>
            <Separator />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
        </section>
    );
}

export function EmployeeRecordMetrics({
    employmentType,
    employmentStartDate,
    employmentEndDate,
    adjustedCostFY,
    adjustedCostFYTD,
    projectedInvoicedAmountFY,
    invoicedAmount,
    projectedProfitabilityFY,
    profitabilityFY,
    profitabilityFYTD,
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <MetricField
                    label="Employment Type"
                    value={employmentType}
                    description="The employee's contract type, such as Full-Time or Part-Time."
                />
                <MetricField
                    label="Start Date"
                    value={employmentStartDate}
                    description="The date the employee started their employment."
                />
                {employmentEndDate && (
                    <MetricField
                        label="End Date"
                        value={employmentEndDate}
                        description="The date the employee's employment ended, if applicable."
                    />
                )}
            </div>

            <MetricSection title="Cost">
                <MetricField
                    label="Adjusted Cost FY"
                    value={adjustedCostFY}
                    description="Total adjusted employment cost allocated for the full current fiscal year (1 Feb – 31 Jan)."
                />
                <MetricField
                    label="Adjusted Cost FYTD"
                    value={adjustedCostFYTD}
                    description="Adjusted employment cost for the current fiscal year to date."
                />
            </MetricSection>

            <MetricSection title="Invoiced">
                <MetricField
                    label="Projected Invoiced Amount FY"
                    value={projectedInvoicedAmountFY}
                    description="Sum of projected invoiced amounts from assignments linked to timecards in the current fiscal year, based on each assignment's ProjectedAmountFY__c."
                />
                <MetricField
                    label="Invoiced Amount"
                    value={invoicedAmount}
                    description="Total invoiced amount from timecards in the current fiscal year (sum of TimecardAmount__c) for qualifying external assignments."
                />
            </MetricSection>

            <MetricSection title="Profit">
                <MetricField
                    label="Projected Profitability FY"
                    value={projectedProfitabilityFY}
                    description="Projected Invoiced Amount FY minus Adjusted Cost FY."
                />
                <MetricField
                    label="Profitability FY"
                    value={profitabilityFY}
                    description="Invoiced Amount minus Adjusted Cost FY for the full fiscal year."
                />
                <MetricField
                    label="Profitability FYTD"
                    value={profitabilityFYTD}
                    description="Invoiced Amount minus Adjusted Cost FYTD for the fiscal year to date."
                />
            </MetricSection>
        </div>
    );
}
