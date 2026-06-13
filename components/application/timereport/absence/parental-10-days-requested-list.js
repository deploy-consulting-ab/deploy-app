'use client';

import { getParentalLeave10DaysRequests } from '@/actions/flex/flex-actions';
import { AbsenceRequestedListComponent } from '@/components/application/timereport/absence/absence-requested-list';
import { PARENTAL_LEAVE_10_DAYS_TYPE_ID } from '@/actions/flex/constants';

const PARENTAL_LEAVE_10_DAYS_LABELS = {
    singular: 'parental leave (10 days) request',
    plural: 'parental leave (10 days) requests',
    updateSuccess: 'Parental leave (10 days) request updated successfully',
    updateError: 'Error updating parental leave (10 days) request',
    deleteSuccess: 'Parental leave (10 days) request deleted successfully',
    deleteError: 'Error deleting parental leave (10 days) request',
    loading: 'Loading parental leave (10 days) requests...',
};

export function Parental10DaysRequestedListComponent({ employmentNumber, employeeName }) {
    return (
        <AbsenceRequestedListComponent
            employmentNumber={employmentNumber}
            employeeName={employeeName}
            absenceTypeId={PARENTAL_LEAVE_10_DAYS_TYPE_ID}
            fetchRequests={getParentalLeave10DaysRequests}
            labels={PARENTAL_LEAVE_10_DAYS_LABELS}
            pageSize={5}
        />
    );
}
