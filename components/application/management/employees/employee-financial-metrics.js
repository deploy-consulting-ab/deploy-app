'use client';

import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CardTitle } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

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

function MetricSectionContent({ children }) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

export function EmployeeFinancialMetrics({
    adjustedCostFY,
    adjustedCostFYTD,
    projectedInvoicedAmountFY,
    invoicedAmount,
    projectedProfitabilityFY,
    profitabilityFY,
    profitabilityFYTD,
}) {
    return (
        <Accordion
            type="multiple"
            defaultValue={['cost', 'invoiced', 'profit']}
            className="w-full rounded-lg"
        >
            <AccordionItem value="cost">
                <AccordionTrigger className="px-4 hover:no-underline">
                    <CardTitle className="text-base">Cost</CardTitle>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                    <MetricSectionContent>
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
                    </MetricSectionContent>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="invoiced">
                <AccordionTrigger className="px-4 hover:no-underline">
                    <CardTitle className="text-base">Invoiced</CardTitle>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                    <MetricSectionContent>
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
                    </MetricSectionContent>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="profit">
                <AccordionTrigger className="px-4 hover:no-underline">
                    <CardTitle className="text-base">Profit</CardTitle>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                    <MetricSectionContent>
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
                    </MetricSectionContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
