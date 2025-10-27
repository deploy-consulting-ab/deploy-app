'use server';

import { NoResultsError, NetworkError, ApiError } from '../callouts/errors.js';
import { calculateHolidays, calculateNextResetDate, generateDateRange } from '@/lib/utils.js';
import { getFlexApiService } from './flex-service.js';

export async function getAbsenceApplications(employeeNumber, options = { cache: 'no-store' }) {
    try {
        const flexApiClient = await getFlexApiService();
        flexApiClient.config.cache = options.cache;

        const response = await flexApiClient.getAbsenceApplications(employeeNumber);

        if (!response?.Result) {
            throw new NoResultsError('No holidays found');
        }

        const holidays = calculateHolidays(response.Result);

        holidays.totalHolidays = 30; // Potentially get from flex
        holidays.availableHolidays = holidays.totalHolidays - holidays.currentFiscalUsedHolidays;
        
        // Format dates as ISO strings before sending to client
        holidays.recentHolidayPeriods = holidays.holidayPeriods
            .slice(0, 3)
            .map(period => ({
                ...period,
                fromDate: period.fromDate.toISOString().split('T')[0],
                toDate: period.toDate.toISOString().split('T')[0]
            }));
            
        holidays.nextResetDate = calculateNextResetDate(new Date()).toISOString().split('T')[0];
        
        // Convert all holiday range dates to ISO strings
        holidays.allHolidaysRange = [];
        for (const holiday of holidays.holidayPeriods) {
            const range = generateDateRange(holiday.fromDate, holiday.toDate);
            holidays.allHolidaysRange.push(...range.map(date => date.toISOString()));
        }

        return holidays;
    } catch (error) {
        console.error('Error in getAbsenceApplications:', {
            name: error.name,
            message: error.message,
            status: error.status,
            code: error.code,
        });

        if (error instanceof NoResultsError) {
            throw error;
        }

        if (error instanceof NetworkError || error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error.message || 'Failed to fetch absence applications',
            error.status,
            error.code
        );
    }
}
