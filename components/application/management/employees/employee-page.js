import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmployeeRecordCardComponent } from '@/components/application/management/employees/employee-record-card';
import { EmployeeFinancialCardComponent } from '@/components/application/management/employees/employee-financial-card';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { AssignmentsListComponent } from '@/components/application/assignment/assignments-list';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';

export function EmployeePageComponent({
    employeeId,
    employee,
    assignments,
    assignmentsMetrics,
    flexEmployeeId,
    occupancyData,
    stats,
    fyAmounts,
    formattedToday,
    historyStartDate,
    errors,
}) {
    return (
        <div className="flex flex-col">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1 hover:cursor-pointer">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="occupancy-rates" className="flex-1 hover:cursor-pointer">
                        Occupancy Rates
                    </TabsTrigger>
                    <TabsTrigger value="assignments" className="flex-1 hover:cursor-pointer">
                        Assignments
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="py-4">
                    <div className="mb-6 space-y-6">
                        <EmployeeRecordCardComponent employee={employee} error={errors.employee} />
                        <EmployeeFinancialCardComponent
                            employee={employee}
                            fyAmounts={fyAmounts}
                            error={errors.employee}
                        />
                    </div>
                    <OccupancyStatsComponent stats={stats} error={errors.stats} />
                </TabsContent>
                <TabsContent value="occupancy-rates" className="py-4">
                    <OccupancyListComponent
                        occupancyData={occupancyData}
                        flexEmployeeId={flexEmployeeId}
                        formattedToday={formattedToday}
                        historyStartDate={historyStartDate}
                        error={errors.history}
                        statsRoute={`${EMPLOYEES_LIST_ROUTE}/${employeeId}/stats`}
                    />
                </TabsContent>
                <TabsContent value="assignments" className="py-4">
                    <AssignmentsListComponent
                        error={errors.assignments}
                        assignments={assignments}
                        employeeNumber={employee?.employeeId}
                        assignmentsMetrics={assignmentsMetrics}
                        assignmentRoute={`${EMPLOYEES_LIST_ROUTE}/${employeeId}`}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
