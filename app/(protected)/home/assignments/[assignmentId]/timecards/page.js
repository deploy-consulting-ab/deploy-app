'use server';

import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimecards } from '@/actions/salesforce/salesforce-actions';
import { sampleAssignmentData } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

const TimecardsPage = async ({ params }) => {
    const { assignmentId } = await params;
    
    let timecards = null;
    let error = null;

    try {
        timecards = await getAssignmentTimecards(assignmentId);
        console.log('timecards', timecards);
    } catch (err) {
        error = err;
        console.log('error', error);
    }

    // For testing: Merge real assignment data with sample timecard data
    const assignment = {
        timecards: sampleAssignmentData.timecards,
    };

    if (!assignment) {
        notFound();
    }

    return (
        // <div className="container mx-auto py-6">
        //     <Card>
        //         <CardHeader className="border-b">
        //             <CardTitle className="text-2xl">
        //                 Time Reports - {assignment.name}
        //             </CardTitle>
        //         </CardHeader>
        //         <CardContent className="pt-6">
        //             <TimecardListComponent timecards={assignment.timecards} />
        //         </CardContent>
        //     </Card>
        // </div>
        <div className="py-4">
            <TimecardListComponent error={error} timecards={assignment.timecards} />
        </div>
    );
};

export default TimecardsPage;
