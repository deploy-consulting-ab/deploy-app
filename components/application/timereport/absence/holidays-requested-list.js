'use client';

import { getHolidayRequests } from '@/actions/flex/flex-actions';
import { AbsenceRequestedListComponent } from './absence-requested-list';
import { HOLIDAY_TYPE_ID } from '@/actions/flex/constants';

/**
 * Holiday-specific labels for the absence list
 */
const HOLIDAY_LABELS = {
    singular: 'holiday request',
    plural: 'holiday requests',
    updateSuccess: 'Holiday request updated successfully',
    updateError: 'Error updating holiday request',
    deleteSuccess: 'Holiday request deleted successfully',
    deleteError: 'Error deleting holiday request',
    loading: 'Loading holiday requests...',
};

/**
 * Holidays requested list component - wrapper around the generic AbsenceRequestedListComponent
 * for displaying and managing holiday absence requests
 *
 * @param {Object} props
 * @param {string} props.employmentNumber - The employee number
 * @param {string} props.employeeName - The employee name
 */
export function HolidaysRequestedListComponent({ employmentNumber, employeeName }) {
    return (
        <AbsenceRequestedListComponent
            employmentNumber={employmentNumber}
            employeeName={employeeName}
            absenceTypeId={HOLIDAY_TYPE_ID}
            fetchRequests={getHolidayRequests}
            labels={HOLIDAY_LABELS}
            pageSize={5}
        />
    );
}
