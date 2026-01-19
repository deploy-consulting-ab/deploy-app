'use server';

import { Card } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

export async function MetricsCardComponent({ metric, title, IconComponent, description }) {
    return (
        <Card className="p-4 border-0 rounded-xl hover:bg-muted/80 transition-all cursor-pointer group h-full">
            <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-lg">
                    {IconComponent}
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[var(--deploy-accent-lime)] transition-colors" />
            </div>
            <div className="md:text-lg transition-colors mb-2">
                {title}
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1">{metric}</div>
            <div className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                {description}
            </div>
        </Card>
    );
}
