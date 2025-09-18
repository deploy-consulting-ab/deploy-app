'use server';

import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimecards } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const TimecardsPage = async ({ params }) => {
    const { assignmentId } = await params;

    const session = await auth();
    const { user } = session;

    let timecards = null;
    let error = null;

    try {
        timecards = await getAssignmentTimecards(assignmentId, user?.employeeNumber);
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
