import { Card } from '@/components/ui/card';

const OCCUPANCY_LEVELS = [
    { min: 0, max: 85, label: 'Below Target', color: 'var(--occupancy-color-critical-low)' },
    { min: 85, max: 93, label: 'Target', color: 'var(--occupancy-color-target)' },
    { min: 93, max: 100, label: 'Optimal', color: 'var(--occupancy-color-optimal)' },
    { min: 100, max: 120, label: 'Full', color: 'var(--occupancy-color-full)' },
    { min: 120, max: Infinity, label: 'Over Capacity', color: 'var(--occupancy-color-critical-high)' },
];

function getOccupancyLevel(value) {
    if (!value && value !== 0) return OCCUPANCY_LEVELS[0];
    const numValue = Number(value);
    return (
        OCCUPANCY_LEVELS.find((level) => numValue >= level.min && numValue < level.max) ||
        OCCUPANCY_LEVELS[0]
    );
}

function OccupancyRateBadge({ rate }) {
    const level = getOccupancyLevel(rate);
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
                backgroundColor: `color-mix(in oklch, ${level.color} 18%, transparent)`,
                color: level.color,
            }}
        >
            {level.label}
        </span>
    );
}

export function OccupancyStatCard({ title, rate, subtitle, monthCount }) {
    const level = getOccupancyLevel(rate);
    const formattedRate = rate != null ? `${rate}%` : '—';

    return (
        <Card className="p-5 border-border/50">
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="flex items-end justify-between gap-2">
                    <span
                        className="text-3xl font-bold tabular-nums"
                        style={{ color: rate != null ? level.color : undefined }}
                    >
                        {formattedRate}
                    </span>
                    {rate != null && <OccupancyRateBadge rate={rate} />}
                </div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">
                        {subtitle}
                        {monthCount != null && ` · ${monthCount} month${monthCount !== 1 ? 's' : ''}`}
                    </p>
                )}
            </div>
        </Card>
    );
}
