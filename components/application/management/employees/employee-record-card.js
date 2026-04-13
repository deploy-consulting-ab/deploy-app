import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Briefcase, CalendarDays, Tag, User } from 'lucide-react';
import { formatDateToSwedish } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export async function EmployeeRecordCardComponent({ employee, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const { name, isActive, employeeId, employmentType, employmentStartDate, employmentEndDate } =
        employee;

    console.log(employee);

    return (
        <Card className="w-full transition-all hover:shadow-md">
            <CardHeader className="space-y-1 border-b">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <Badge className={`${isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Employee Name</p>
                            <p className="font-medium">{name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Employee ID</p>
                            <p className="font-medium">{employeeId}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Employment Type</p>
                            <p className="font-medium">{employmentType}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Employment Start Date</p>
                            <p className="font-medium">
                                {formatDateToSwedish(employmentStartDate)}
                            </p>
                        </div>
                    </div>
                    {employmentEndDate && (
                        <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Employment End Date</p>
                                <p className="font-medium">
                                    {formatDateToSwedish(employmentEndDate)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
