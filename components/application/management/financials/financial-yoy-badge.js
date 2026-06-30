import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatSEK, formatPercentChange } from '@/lib/utils';

function FinancialYoYBadge({ value, invertColors = false }) {
    const label = formatPercentChange(value);
    if (!label) return null;

    const isPositive = value > 0;
    const isNeutral = value === 0;
    const isFavorable = invertColors ? !isPositive : isPositive;

    const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

    const colorClass = isNeutral
        ? 'text-muted-foreground bg-muted/60 border-border/50'
        : isFavorable
          ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400'
          : 'text-red-700 bg-red-500/10 border-red-500/20 dark:text-red-400';

    return (
        <span
            className={`inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium tabular-nums leading-none ${colorClass}`}
        >
            <Icon className="h-2.5 w-2.5 shrink-0" />
            {label}
        </span>
    );
}

export function FinancialMetricCell({ value, yoyPercent, invertColors = false }) {
    return (
        <div className="flex flex-col items-start gap-1">
            <div className="tabular-nums text-foreground/80">{formatSEK(value)}</div>
            <FinancialYoYBadge value={yoyPercent} invertColors={invertColors} />
        </div>
    );
}
