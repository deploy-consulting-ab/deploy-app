'use server';

import { NoResultsError, NetworkError, ApiError } from '../callouts/errors.js';
import { calculateHolidays, calculateNextResetDate, generateDateRange } from '@/lib/utils.js';
import { getFlexApiService } from './flex-service.js';
import { PROJECT_TYPE_ID, WORKING_TYPE_ID } from './constants.js';
import { formatDateToISOString } from '@/lib/utils.js';

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
        holidays.recentHolidayPeriods = holidays.holidayPeriods.slice(0, 3).map((period) => ({
            ...period,
            fromDate: period.fromDate.toISOString().split('T')[0],
            toDate: period.toDate.toISOString().split('T')[0],
        }));

        holidays.nextResetDate = calculateNextResetDate(new Date()).toISOString().split('T')[0];

        // Convert all holiday range dates to ISO strings
        holidays.allHolidaysRange = [];
        for (const holiday of holidays.holidayPeriods) {
            const range = generateDateRange(holiday.fromDate, holiday.toDate);
            holidays.allHolidaysRange.push(...range.map((date) => date.toISOString()));
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

export async function createTimecard(employeeId, timecard) {
    try {
        const flexApiClient = await getFlexApiService();

        // TO DO: FIX THIS
        employeeId = 'f0435e81-c674-49d5-aacd-b10f0109f7fc';

        const promises = timecard.timeData.map(async (timereport) => {
            // FIX THIS
            // const date = formatDateToISOString(timereport.date);
            const date = '2026-01-06';

            console.log('timereport...', timereport);

            const timeRows = timereport.timeRows.map((timeRow) => {
                return {
                    accounts: [
                        {
                            accountDistributionId: PROJECT_TYPE_ID,
                            id: timeRow.projectId,
                        },
                    ],
                    fromTime: 0,
                    tomTime: timeRow.hours,
                    timeCode: {
                        code: 'ARB',
                    },
                };
            });

            const body = {
                timeRows: timeRows,
            };

            const response = await flexApiClient.createTimecard(employeeId, date, body);
            return response?.status;
        });

        return await Promise.all(promises);
    } catch (error) {
        throw error;
    }
}

export async function getTimereports(employeeId, weekStartDate, weekEndDate) {
    try {
        employeeId = 'f0435e81-c674-49d5-aacd-b10f0109f7fc';
        // weekStartDate = '2025-12-01';
        // weekEndDate = '2025-12-07';
        // weekStartDate = '2025-11-10';
        // weekEndDate = '2025-11-16';
        const flexApiClient = await getFlexApiService();
        const timereports = await flexApiClient.getTimereports(
            employeeId,
            weekStartDate,
            weekEndDate
        );

        const selectedProjects = new Set();

        const timereportResponse = timereports
            .filter((timereport) => timereport.TimeRows?.length > 0)
            .map((timereport) => ({
                date: timereport.Date,
                timeRows: timereport.TimeRows.map((timeRow) => {
                    if (timeRow.TimeCode.Id === WORKING_TYPE_ID) {
                        const projectAccount = timeRow.Accounts.find(
                            (account) => account.AccountDistribution.Id === PROJECT_TYPE_ID
                        );
                        if (!projectAccount) {
                            return null;
                        }

                        selectedProjects.add(projectAccount.Id);

                        return {
                            projectId: projectAccount.Id,
                            projectName: projectAccount.Name,
                            projectCode: projectAccount.Code,
                            hours: timeRow.TimeInMinutes / 60,
                        };

                        // Other types of absences
                    } else {
                        return {
                            projectId: timeRow.TimeCode.Id,
                            projectName: timeRow.TimeCode.Name,
                            projectCode: timeRow.TimeCode.Code,
                            hours: timeRow.TimeInMinutes / 60,
                        };
                    }
                }).filter(Boolean),
            }));

        return {
            timereportResponse,
            selectedProjects,
        };
    } catch (error) {
        throw error;
    }
}
