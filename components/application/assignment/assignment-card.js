import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateToSwedish } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

const getStageColor = (projectStatus) => {
    switch (projectStatus.toLowerCase()) {
        case 'in progress':
            return 'bg-blue-500';
        case 'done':
            return 'bg-green-500';
        case 'not started':
            return 'bg-gray-500';
        default:
            return 'bg-gray-500';
    }
};

export function AssignmentCard({ assignment }) {
    const { id, name, startDate, endDate, projectStatus, projectName } = assignment;

    return (
        <Card className="w-full transition-all hover:shadow-lg">
            <CardHeader className="space-y-1 border-b">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <Badge className={`${getStageColor(projectStatus)} text-white`}>
                        {projectStatus}
                    </Badge>
                </div>
                <CardDescription>Assignment #{id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">{formatDateToSwedish(startDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">End Date</p>
                            <p className="font-medium">{formatDateToSwedish(endDate)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
