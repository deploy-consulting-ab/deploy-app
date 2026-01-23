'use server';

import { NoResultsError, NetworkError, ApiError } from '../callouts/errors.js';
import {
    calculateHolidays,
    calculateNextResetDate,
    generateDateRange,
    getUTCToday,
} from '@/lib/utils.js';
import { getFlexApiService } from './flex-service.js';
import { PROJECT_TYPE_ID, WORKING_TYPE_ID, HOLIDAY_TYPE_ID, COMPANY_ID } from './constants.js';
import { formatDateToISOString } from '@/lib/utils.js';
import chalk from 'chalk';

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

        holidays.nextResetDate = calculateNextResetDate(getUTCToday()).toISOString().split('T')[0];

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

/**
 * Converts decimal hours to "HH:MM" time format string.
 * Examples:
 *   0 -> "00:00"
 *   1 -> "01:00"
 *   1.5 -> "01:30"
 *   2.5 -> "02:30"
 *   10.5 -> "10:30"
 */
function hoursToTimeString(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export async function createTimecard(flexEmployeeId, timecard) {
    try {
        const flexApiClient = await getFlexApiService();
        const promises = timecard.timeData.map(async (timereport) => {
            const date = formatDateToISOString(timereport.date);

            // Rows can't overlap, so passing from 0 tom 9 and then from 0 tom 6, throws an error
            let previousTomHours = 0;

            const timeRows = timereport.timeRows.map((timeRow) => {
                const tomHours = previousTomHours + timeRow.hours;
                const body = {
                    accounts: [
                        {
                            accountDistributionId: PROJECT_TYPE_ID,
                            id: timeRow.projectId,
                        },
                    ],
                    externalComment: '.', // Pass some external comment to prevent adding an extra row
                    fromTime: hoursToTimeString(previousTomHours),
                    tomTime: hoursToTimeString(tomHours),
                    timeCode: {
                        code: 'ARB',
                    },
                };
                previousTomHours = tomHours;
                return body;
            });

            const body = {
                timeRows: timeRows,
            };

            return await flexApiClient.createTimecard(flexEmployeeId, date, body);
        });

        return await Promise.all(promises);
    } catch (error) {
        throw error;
    }
}

export async function getTimereports(flexEmployeeId, weekStartDate, weekEndDate) {
    const flexApiClient = await getFlexApiService();
    flexApiClient.config.cache = 'no-store'; // force-cache'; -> this will return the data from he cache

    try {
        const timereports = await flexApiClient.getTimereports(
            flexEmployeeId,
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

                        // We do not have a project type in Flex, so we use a regex to determine the color
                        const regex = /deploy/i;
                        const isInternalProject = regex.test(projectAccount.Name);
                        const color = isInternalProject ? '#6b7280' : '#3b82f6';

                        return {
                            projectId: projectAccount.Id,
                            projectName: projectAccount.Name,
                            projectCode: projectAccount.Code,
                            hours: timeRow.TimeInMinutes / 60,
                            color: color,
                            isWorkingTime: true,
                        };

                        // Other types of absences
                    } else {
                        return {
                            projectId: timeRow.TimeCode.Id,
                            projectName: timeRow.TimeCode.Name,
                            projectCode: timeRow.TimeCode.Code,
                            hours: timeRow.TimeInMinutes / 60,
                            color: 'red',
                            isWorkingTime: false,
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

export async function createAbsenceApplication(
    employmentNumber,
    absenceApplicationType,
    absenceApplicationData
) {
    try {
        switch (absenceApplicationType) {
            case 'holiday-absence-request':
                return createHolidayAbsenceApplication(employmentNumber, absenceApplicationData);
            default:
                throw new Error('Invalid absence application type');
        }
    } catch (error) {
        throw error;
    }
}

function createHolidayAbsenceApplication(employmentNumber, absenceApplicationData) {
    try {
        const absenceApplication = {
            absenceTypeId: HOLIDAY_TYPE_ID,
            companyId: COMPANY_ID,
            employmentNumber: employmentNumber,
            fromDate: absenceApplicationData.startDate,
            toDate: absenceApplicationData.endDate,
            ...(absenceApplicationData.isSameDay && { hours: absenceApplicationData.hours }),
        };

        console.log('## absenceApplication', absenceApplication);

        return absenceApplication;
    } catch (error) {
        throw error;
    }
}
