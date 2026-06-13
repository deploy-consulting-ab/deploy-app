'use client';

import { getSickLeaveRequests } from '@/actions/flex/flex-actions';
import { AbsenceRequestedListComponent } from '@/components/application/timereport/absence/absence-requested-list';
import { SICK_LEAVE_TYPE_ID } from '@/actions/flex/constants';

/**
 * Sick leave-specific labels for the absence list
 */
const SICK_LEAVE_LABELS = {
    singular: 'sick leave request',
    plural: 'sick leave requests',
    updateSuccess: 'Sick leave request updated successfully',
    updateError: 'Error updating sick leave request',
    deleteSuccess: 'Sick leave request deleted successfully',
    deleteError: 'Error deleting sick leave request',
    loading: 'Loading sick leave requests...',
};

/**
 * Sick leave requested list component - wrapper around the generic AbsenceRequestedListComponent
 * for displaying and managing sick leave absence requests
 *
 * @param {Object} props
 * @param {string} props.employmentNumber - The employee number
 * @param {string} props.employeeName - The employee name
 */
export function SickRequestedListComponent({ employmentNumber, employeeName }) {
    return (
        <AbsenceRequestedListComponent
            employmentNumber={employmentNumber}
            employeeName={employeeName}
            absenceTypeId={SICK_LEAVE_TYPE_ID}
            fetchRequests={getSickLeaveRequests}
            labels={SICK_LEAVE_LABELS}
            pageSize={5}
        />
    );
}
