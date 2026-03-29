import { auth } from '@/auth';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';

export default async function OccupancyStatsPage() {
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Occupancy Statistics</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Overview of your occupancy rates across different time periods.
                </p>
            </div>
            <OccupancyStatsComponent employeeNumber={employeeNumber} />
        </div>
    );
}
