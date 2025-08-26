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
    } catch (err) {
        error = err;
    }

    if (!timecards) {
        notFound();
    }

    return (
        <div className="py-4">
            <TimecardListComponent error={error} timecards={timecards} />
        </div>
    );
};

export default TimecardsPage;
