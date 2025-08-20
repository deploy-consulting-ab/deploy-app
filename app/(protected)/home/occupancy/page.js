import { OccupancyCard } from '@/components/application/occupancy-card';
import { employeeData } from '@/lib/mock-data';
import { OccupancyChartComponent } from '@/components/application/occupancy/occupancy-chart';

export default function OccupancyPage() {
    return (
            <div className="py-4">
                <OccupancyChartComponent />
            </div>
    );
}
