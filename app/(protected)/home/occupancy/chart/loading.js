import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OccupancyChartLoading() {
    return (
        <Card className="@container/card h-[400px] sm:h-[calc(100vh-7rem)]" variant="shadow">
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="flex-1 h-[calc(100%-10rem)]">
                <div className="flex flex-col h-full gap-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-16 flex-1" />
                        <Skeleton className="h-16 flex-1" />
                        <Skeleton className="h-16 flex-1" />
                    </div>
                    <Skeleton className="flex-1 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}
