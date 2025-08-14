import { TimecardListComponent } from "@/components/application/assignment/timecard-list";
import { getAssignmentById } from "@/actions/salesforce/salesforce-actions";
import { sampleAssignmentData } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

const TimecardsPage = async ({ params }) => {
    const { assignmentId } = await params;
    const realAssignment = await getAssignmentById(assignmentId);
    
    if (!realAssignment) {
        notFound();
    }

    // For testing: Merge real assignment data with sample timecard data
    const assignment = {
        ...realAssignment,
        timecards: sampleAssignmentData.timecards
    };

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
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-8 pt-4">
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-1">
                    <TimecardListComponent timecards={assignment.timecards} />
                </div>
            </div>
        </div>
    );
};

export default TimecardsPage;
