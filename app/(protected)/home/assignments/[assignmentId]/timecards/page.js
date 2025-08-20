import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentById } from '@/actions/salesforce/salesforce-actions';
import { sampleAssignmentData } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

const TimecardsPage = async ({ params }) => {
    const { assignmentId } = await params;
    let realAssignment = null;
    let error = null;

    try {
        realAssignment = await getAssignmentById(assignmentId);
    } catch (err) {
        error = err;
    }

    // For testing: Merge real assignment data with sample timecard data
    const assignment = {
        ...realAssignment,
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
