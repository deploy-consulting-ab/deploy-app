import { OccupancyCard } from '@/components/application/occupancy-card';
import { employeeData } from '@/lib/mock-data';
import { OccupancyChartComponent } from '@/components/application/occupancy/occupancy-chart';

export default function OccupancyPage() {
    return (
        <div className="">
            <div className="space-y-8 py-4">
                <OccupancyChartComponent />
            </div>
        </div>
    );
}
