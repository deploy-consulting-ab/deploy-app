'use client';

import { getParentalLeaveRequests } from '@/actions/flex/flex-actions';
import { AbsenceRequestedListComponent } from '@/components/application/timereport/absence/absence-requested-list';
import { PARENTAL_LEAVE_TYPE_ID } from '@/actions/flex/constants';

const PARENTAL_LEAVE_LABELS = {
    singular: 'parental leave request',
    plural: 'parental leave requests',
    updateSuccess: 'Parental leave request updated successfully',
    updateError: 'Error updating parental leave request',
    deleteSuccess: 'Parental leave request deleted successfully',
    deleteError: 'Error deleting parental leave request',
    loading: 'Loading parental leave requests...',
};

export function ParentalDaysRequestedListComponent({ employmentNumber, employeeName }) {
    return (
        <AbsenceRequestedListComponent
            employmentNumber={employmentNumber}
            employeeName={employeeName}
            absenceTypeId={PARENTAL_LEAVE_TYPE_ID}
            fetchRequests={getParentalLeaveRequests}
            labels={PARENTAL_LEAVE_LABELS}
            pageSize={5}
        />
    );
}
