'use server';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export async function MetricsCardComponent({ metric, title, IconComponent, description }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer min-h-[20px] flex flex-col">
            <CardHeader className="space-y-1">
                <div className="flex items-start space-x-2">
                    <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        {IconComponent}
                    </div>
                    <CardTitle className="text-base md:text-lg lg:text-xl leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold pb-2">{metric}</div>
                <CardDescription className="text-xs md:text-sm">{description}</CardDescription>
            </CardContent>
        </Card>
    );
}
