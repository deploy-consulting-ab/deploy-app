'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDateToSwedish, getAssignmentStageColor } from '@/lib/utils';

export function AssignmentCardPhoneComponent({ assignment, onClick }) {
    return (
        <Card
            className="w-full mb-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onClick?.(assignment.id)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{assignment.name}</CardTitle>
                    <Badge
                        className={`${getAssignmentStageColor(assignment.projectStatus)} text-white ml-2`}
                    >
                        {assignment.projectStatus}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm text-gray-500">Project</p>
                        <p className="font-medium">{assignment.projectName}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">
                                {assignment.startDate
                                    ? formatDateToSwedish(assignment.startDate)
                                    : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium">
                                {assignment.endDate ? formatDateToSwedish(assignment.endDate) : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
