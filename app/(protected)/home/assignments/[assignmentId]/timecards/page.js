'use server';

import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimecards } from '@/actions/salesforce/salesforce-actions';

const TimecardsPage = async ({ params }) => {
    const { assignmentId } = await params;
    
    let timecards = null;
    let error = null;

    try {
        timecards = await getAssignmentTimecards(assignmentId);
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <TimecardListComponent error={error} timecards={timecards} />
        </div>
    );
};

export default TimecardsPage;
