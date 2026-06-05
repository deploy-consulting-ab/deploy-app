import { Skeleton } from '@/components/ui/skeleton';

export default function OccupancyPeriodLoading() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-28" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-7 gap-0">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-9 rounded-none" />
                        ))}
                    </div>
                    {Array.from({ length: 5 }).map((_, wi) => (
                        <div key={wi} className="grid grid-cols-7">
                            {Array.from({ length: 7 }).map((_, di) => (
                                <Skeleton key={di} className="h-[100px] rounded-none" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
