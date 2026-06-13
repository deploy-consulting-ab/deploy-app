'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import Link from 'next/link';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const DEFAULT_STATS = [];

export function StatisticsCardComponent({
    stats = DEFAULT_STATS,
    title = 'Assignments',
    refreshAction,
    error,
}) {
    const isMobile = useIsMobile();
    const [isPending, startTransition] = useTransition();

    function handleRefresh() {
        startTransition(async () => {
            await refreshAction();
        });
    }

    if (error) {
        return (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
                <p className="text-sm text-destructive">{error}</p>
            </Card>
        );
    }

    if (!stats || stats.length === 0) {
        return (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
                <p className="text-sm text-muted-foreground">No statistics available</p>
            </Card>
        );
    }

    return (
        <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between">
                <CardTitle className={`${isMobile ? 'text-sm' : 'text-xl'}`}>{title}</CardTitle>
                <div className="flex items-center gap-2">
                    {refreshAction && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isPending}
                            className={cn(isPending ? 'animate-spin' : '', 'hover:cursor-pointer')}
                        >
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Assignment Stats Cards with Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-border/50">
                {stats.map((stat, index) => {
                    const viewFilter = stat.label?.toLowerCase();
                    const href = `${ASSIGNMENTS_ROUTE}?view=${viewFilter}`;

                    return (
                        <Link key={stat.id || index} href={href}>
                            <Card className="p-4 bg-muted/50 border-0 rounded-xl hover:bg-muted/80 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[var(--deploy-accent-lime)] transition-colors" />
                                </div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </Card>
    );
}
