import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateToSwedish } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { MetricField } from '@/components/application/management/employees/employee-financial-metrics';

export async function EmployeeRecordCardComponent({ employee, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const { name, isActive, employeeId, employmentType, employmentStartDate, employmentEndDate } =
        employee;

    return (
        <Card className="w-full transition-all hover:shadow-md border-l-4 border-l-deploy-blue">
            <CardHeader className="space-y-1 border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">{employeeId}</p>
                    </div>
                    <Badge
                        className={
                            isActive
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
                        }
                        variant="outline"
                    >
                        <span className="uppercase">{isActive ? 'Active' : 'Inactive'}</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <MetricField
                        label="Employment Type"
                        value={employmentType}
                        description="The employee's contract type, such as Full-Time or Part-Time."
                    />
                    <MetricField
                        label="Start Date"
                        value={formatDateToSwedish(employmentStartDate)}
                        description="The date the employee started their employment."
                    />
                    {employmentEndDate && (
                        <MetricField
                            label="End Date"
                            value={formatDateToSwedish(employmentEndDate)}
                            description="The date the employee's employment ended, if applicable."
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
