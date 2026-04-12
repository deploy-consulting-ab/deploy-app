import { getEmployeeById } from '@/actions/salesforce/salesforce-actions';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { getOccupancyHistory, getOccupancyStats } from '@/actions/salesforce/salesforce-actions';
import { formatDateToISOString, getUTCToday } from '@/lib/utils';

const EmployeePage = async ({ params }) => {
    const { employeeId } = await params;
    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    let statsError = null;
    let historyError = null;
    let employeeNumber = null;
    let occupancyData = [];
    let stats = null;

    try {
        const employee = await getEmployeeById(employeeId);
        employeeNumber = employee.EmployeeId__c;
    } catch (err) {
        statsError = err;
        historyError = err;
    }

    if (employeeNumber) {
        const [statsResult, historyResult] = await Promise.allSettled([
            getOccupancyStats(employeeNumber, formattedToday),
            getOccupancyHistory(employeeNumber, formattedToday),
        ]);

        if (statsResult.status === 'fulfilled') {
            stats = statsResult.value;
        } else {
            statsError = statsResult.reason;
        }

        if (historyResult.status === 'fulfilled') {
            occupancyData = historyResult.value;
        } else {
            historyError = historyResult.reason;
        }
    }

    return (
        <div className="flex flex-col">
            <div className="mb-6">
                <OccupancyStatsComponent stats={stats} error={statsError} />
            </div>
            <OccupancyListComponent
                occupancyData={occupancyData}
                employeeNumber={employeeNumber}
                formattedToday={formattedToday}
                error={historyError}
            />
        </div>
    );
};

export default EmployeePage;
