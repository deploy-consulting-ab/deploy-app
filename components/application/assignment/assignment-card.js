'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateToSwedish, getAssignmentStageColor } from '@/lib/utils';
import { CalendarDays, Briefcase, Info, Clock, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export function AssignmentCard({ assignment, error }) {

    const isMobile = useIsMobile();

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const { name, startDate, endDate, projectStatus, projectName, projectedHours, actualHours } =
        assignment;

    return (
        <Card className="w-full transition-all hover:shadow-md">
            <CardHeader className="space-y-1 border-b">
                <div className="flex items-start justify-between">
                    <CardTitle className={`${isMobile ? 'text-sm' : 'text-2xl'}`}>
                        {projectName}
                    </CardTitle>
                    <Badge className={`${getAssignmentStageColor(projectStatus)} text-white`}>
                        {projectStatus}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Assignment Name</p>
                            <p className="font-medium">{name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Project Name</p>
                            <p className="font-medium">{projectName}</p>
                        </div>
                    </div>
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
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Projected Hours</p>
                            <p className="font-medium">{projectedHours} hours</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Actual Hours</p>
                            <p className="font-medium">{actualHours} hours</p>
                        </div>
                    </div>
                </div>

                {/* Link to Timecards */}
                <Link
                    href={`/home/assignments/${assignment.id}/timecards`}
                    className="block w-full"
                >
                    <Card className="transition-colors hover:bg-muted/50">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-2">
                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                <span>View Time Reports</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {actualHours} hours logged
                            </span>
                        </CardContent>
                    </Card>
                </Link>
            </CardContent>
        </Card>
    );
}
