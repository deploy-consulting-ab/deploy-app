import { OccupancyCard } from '@/components/application/occupancy-card';
import { employeeData } from '@/lib/mock-data';
import { OccupancyChartComponent } from '@/components/application/occupancy/occupancy-chart';

export default function OccupancyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-8 pt-4">
                <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                        <OccupancyChartComponent />
                    </div>
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                        <OccupancyCard occupancy={employeeData.occupancy} />
                    </div>
                </div>
            </div>
        </div>
    );
}
