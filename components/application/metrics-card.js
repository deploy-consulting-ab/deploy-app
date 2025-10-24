'use server';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export async function MetricsCardComponent({ metric, title, IconComponent, description }) {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">{IconComponent}</div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold pb-2">{metric}</div>
                <CardDescription>{description}</CardDescription>
            </CardContent>
        </Card>
    );
}
