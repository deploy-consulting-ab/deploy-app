'use client';

import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';

const SEK = 'SEK';
const fmt = (v) => formatCurrency(v, SEK);

export const EMPLOYEE_FINANCIAL_TOOLTIPS = {
    projectedInvoicedFY:
        "Sum of projected invoiced amounts from assignments linked to timecards in the current fiscal year, based on each assignment's Projected Amount FY.",
    invoicedAmount:
        'Total invoiced amount from timecards in the current fiscal year (sum of TimecardAmount__c) for qualifying external assignments.',
    adjustedCostFY:
        'Total adjusted employment cost allocated for the full current fiscal year (1 Feb – 31 Jan).',
    adjustedCostFYTD: 'Adjusted employment cost for the current fiscal year to date.',
    projectedProfitabilityFY: 'Projected Invoiced Amount FY minus Adjusted Cost FY.',
    profitabilityFY: 'Invoiced Amount minus Adjusted Cost FY for the full fiscal year.',
    profitabilityFYTD: 'Invoiced Amount minus Adjusted Cost FYTD for the fiscal year to date.',
};

export function InfoTooltip({ label, description, side = 'top' }) {
    if (!description) return null;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    className="inline-flex shrink-0 cursor-help text-muted-foreground/60 hover:text-muted-foreground"
                    aria-label={`About ${label}`}
                >
                    <Info className="size-3.5" />
                </button>
            </TooltipTrigger>
            <TooltipContent side={side} className="max-w-xs">
                {description}
            </TooltipContent>
        </Tooltip>
    );
}

export function MetricLabel({ label, description, align = 'left' }) {
    return (
        <span
            className={`inline-flex items-center gap-1 min-w-0 ${
                align === 'right' ? 'justify-end' : ''
            }`}
        >
            <span className="truncate">{label}</span>
            <InfoTooltip label={label} description={description} />
        </span>
    );
}

export function ProfitBadge({ value, label = 'FYTD', description }) {
    if (value === null || value === undefined) return null;
    const positive = value >= 0;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={`inline-flex flex-col items-end gap-0.5 text-sm font-semibold px-2.5 py-1 rounded-lg tabular-nums whitespace-nowrap cursor-help ${
                        positive
                            ? 'bg-deploy-blue/10 text-deploy-blue dark:bg-deploy-blue/20 dark:text-deploy-ocean'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                        {label}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        {positive ? (
                            <TrendingUp className="h-4 w-4 shrink-0" />
                        ) : (
                            <TrendingDown className="h-4 w-4 shrink-0" />
                        )}
                        {fmt(value)}
                    </span>
                </span>
            </TooltipTrigger>
            {description && (
                <TooltipContent side="left" className="max-w-xs">
                    {description}
                </TooltipContent>
            )}
        </Tooltip>
    );
}

export function MetricCell({ label, value, description, colored = false }) {
    const hasValue = value !== null && value !== undefined;
    const positive = hasValue && value >= 0;

    return (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight min-w-0">
                <span className="truncate">{label}</span>
                <InfoTooltip label={label} description={description} />
            </span>
            <span
                className={`text-sm font-semibold tabular-nums ${
                    colored && hasValue
                        ? positive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-500 dark:text-red-400'
                        : 'text-foreground'
                }`}
            >
                {fmt(value)}
            </span>
        </div>
    );
}
