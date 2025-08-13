'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateToSwedish } from '@/lib/utils';
import { CalendarDays, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getStageColor = (stage) => {
    switch (stage.toLowerCase()) {
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
    const router = useRouter();
    const { id, name, stage, startDate, endDate, assignee } = assignment;

    const handleClick = () => {
        router.push(`/home/assignments/${id}`);
    };

    return (
        <Card className="w-full transition-all hover:shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <Badge className={`${getStageColor(stage)} text-white`}>
                        {stage}
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
                <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Assignee</p>
                        <p className="font-medium">{assignee}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={handleClick}
                >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
