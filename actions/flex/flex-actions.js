'use server';

import { NoResultsError, NetworkError, ApiError } from '../callouts/errors.js';
import {
    calculateHolidays,
    calculateNextResetDate,
    generateDateRange,
    getUTCToday,
    formatDateToISOString,
} from '@/lib/utils.js';
import { getFlexApiService } from './flex-service.js';
import {
    PROJECT_TYPE_ID,
    WORKING_TYPE_ID,
    HOLIDAY_TYPE_ID,
    COMPANY_ID,
    SICK_LEAVE_TYPE_ID,
    ABSENCE_STATUS_CODE,
    ARTICLE_TYPE_ID,
} from './constants.js';

// Timecard methods
/**
 * Creates timereport entries in Flex for a timecard (multiple days).
 *
 * Processing is two-phase and distinguishes same-day vs different-day work:
 * - **Different days**: Processed in parallel. Phase 1 blanks all days concurrently;
 *   phase 2 creates rows for all days concurrently (each day is handled by createTimeRow).
 * - **Same day**: Within a single day, rows are processed sequentially. Phase 1 sends
 *   one PUT per day with all rows to blank. Phase 2 creates one row at a time for that
 *   day (createTimeRow awaits each createTimerow) so the API can enforce non-overlapping times.
 *
 * @param {string} flexEmployeeId - The Flex employee ID
 * @param {Object} timecard - The timecard with timeData (array of { date, timeRows })
 * @returns {Promise<number[]>} Flat array of HTTP status codes (one per created row across all days)
 */
export async function createTimereport(flexEmployeeId, timecard) {
    const timeDataEntries = timecard.timeData;
    try {
        // Phase 1: blank all time rows first (must finish before creating new rows)
        const blankPromises = timeDataEntries.map((timeDataEntry) =>
            blankTimeRow(flexEmployeeId, timeDataEntry.date, timeDataEntry.timeRows)
        );
        await Promise.all(blankPromises);

        // Phase 2: create time rows after blanks are done
        const createPromises = timeDataEntries
            .map((timereport) => {
                const date = formatDateToISOString(timereport.date);

                // Skip entire day if it contains a full-day absence (8+ hours)
                // The API rejects updates to days that already have full-day absence entries
                const hasFullDayAbsence = timereport.timeRows?.some(
                    (row) => row.isWorkingTime === false && row.hours >= 8
                );

                if (hasFullDayAbsence) {
                    return null;
                }

                const workingTimeRows =
                    timereport.timeRows?.filter(
                        (row) => row.isWorkingTime !== false && (row.hours ?? 0) > 0
                    ) || [];

                // Skip days with no working time entries to create (0-hour rows are only blanked in phase 1)
                if (workingTimeRows.length === 0) {
                    return null;
                }
                return createTimeRow(flexEmployeeId, date, workingTimeRows);
            })
            .filter(Boolean); // Remove null entries (days with no working time)

        // createTimeRow returns a promise that resolves to an array of statuses per day
        const dayResults = await Promise.all(createPromises);
        return dayResults.flat();
    } catch (error) {
        throw error;
    }
}

/**
 * Returns whether a time row has valid project and role IDs for Flex (non-empty).
 * @param {Object} timeRow - Row with projectId and roleFlexId
 * @returns {boolean}
 */
function hasValidAccountIds(timeRow) {
    const projectId = timeRow?.projectId;
    const roleFlexId = timeRow?.roleFlexId;
    return (
        projectId != null &&
        String(projectId).trim() !== '' &&
        roleFlexId != null &&
        String(roleFlexId).trim() !== ''
    );
}

/**
 * createTimerow does not allow updating rows, createTimereport does.
 * However, createTimereport creates multiple rows so we can't use it.
 * Therefore, we must use createTimerow for same day, but delete first and then re-create.
 * Same day: one request with all rows for that date. Different days: called in parallel
 * from createTimereport (one blankTimeRow per day), so multiple days are blanked concurrently.
 *
 * @param {string} flexEmployeeId - The Flex employee ID
 * @param {string} date - Date for the day (YYYY-MM-DD)
 * @param {Object[]} workingTimeRows - Rows to blank (only those with valid project/role IDs are used)
 * @returns {Promise<number>} HTTP status of the PUT
 */
async function blankTimeRow(flexEmployeeId, date, workingTimeRows) {
    const flexApiClient = await getFlexApiService();
    // Only blank rows with valid project and role IDs; skip rows that would create empty Account/Project/Role in Flex
    const validRows = (workingTimeRows || []).filter(hasValidAccountIds);
    if (validRows.length === 0) {
        return;
    }
    // Rows can't overlap, so passing from 0 to 9 and then from 0 to 6 throws an error
    let previousTomHours = 0;

    const timeRows = validRows.map((timeRow) => {
        const tomHours = previousTomHours + timeRow.hours;
        const body = {
            accounts: [
                {
                    accountDistributionId: PROJECT_TYPE_ID,
                    id: timeRow.projectId,
                },
                {
                    accountDistributionId: ARTICLE_TYPE_ID,
                    id: timeRow.roleFlexId,
                },
            ],
            fromTime: 0, // Set to zero to blank the time row
            tomTime: 0, // Set to zero to blank the time row
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
    return flexApiClient.createTimereport(flexEmployeeId, date, body);
}

/**
 * Creates time rows for a single day in Flex. Same day: rows are created sequentially
 * (one POST per row, awaited in order) so the API can enforce non-overlapping times.
 * Different days: createTimereport calls this once per day and awaits all days with
 * Promise.all, so multiple days are processed in parallel.
 *
 * @param {string} flexEmployeeId - The Flex employee ID
 * @param {string} date - Date for the day (YYYY-MM-DD)
 * @param {Object[]} workingTimeRows - Working-time rows to create (valid project/role only)
 * @returns {Promise<number[]>} Array of HTTP status codes (one per created row)
 */
async function createTimeRow(flexEmployeeId, date, workingTimeRows) {
    const flexApiClient = await getFlexApiService();
    // Rows can't overlap; create them sequentially so the API can validate ordering
    let previousTomHours = 0;

    // Only create rows with valid project and role IDs to avoid Flex rows with empty Account/Project/Role
    const validRows = (workingTimeRows || []).filter(hasValidAccountIds);
    const results = [];
    // Await each createTimerow in a loop so for a given day rows are created one by one (API validates ordering).
    for (const timeRow of validRows) {
        const tomHours = previousTomHours + timeRow.hours;
        const body = {
            accounts: [
                {
                    accountDistributionId: PROJECT_TYPE_ID,
                    id: timeRow.projectId,
                },
                {
                    accountDistributionId: ARTICLE_TYPE_ID,
                    id: timeRow.roleFlexId,
                },
            ],
            fromTime: hoursToTimeString(previousTomHours),
            tomTime: hoursToTimeString(tomHours),
            TimeCode: {
                Code: 'ARB',
            },
        };
        previousTomHours = tomHours;
        const status = await flexApiClient.createTimerow(flexEmployeeId, date, body);
        results.push(status);
    }
    return results;
}

/**
 * Get the timereports for a given employee number
 * @param {string} flexEmployeeId - The employee number
 * @param {string} weekStartDate - The start date of the week
 * @param {string} weekEndDate - The end date of the week
 * @returns {Promise<Object>} The timereports
 */
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

                        const articleAccount = timeRow.Accounts.find(
                            (account) => account.AccountDistribution.Id === ARTICLE_TYPE_ID
                        );

                        if (!articleAccount) {
                            return null;
                        }

                        selectedProjects.add(projectAccount.Id);

                        // We do not have a project type in Flex, so we use a regex to determine the color
                        const regex = /deploy/i;
                        const isInternalProject = regex.test(projectAccount.Name);
                        const color = isInternalProject ? '#6b7280' : '#3b82f6';

                        return {
                            articleId: articleAccount.Id,
                            projectId: projectAccount.Id,
                            projectName: projectAccount.Name,
                            projectCode: projectAccount.Code,
                            roleFlexId: articleAccount.Id,
                            hours: timeRow.TimeInMinutes / 60,
                            color: color,
                            isWorkingTime: true,
                            isExistingInFlex: true,
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
                            isExistingInFlex: true,
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

// Absence applications methods

/**
 * Get all absence applications for a given employee number
 * @param {string} employeeNumber - The employee number
 * @returns {Promise<Object>} The absence applications
 */
export async function getAllAbsence(employeeNumber) {
    try {
        const flexApiClient = await getFlexApiService();
        return await flexApiClient.getAbsenceApplications(employeeNumber);
    } catch (error) {
        throw error;
    }
}

/**
 * Get the holidays for a given employee number
 * @param {Object} employeeInformation - The employee information
 * @param {string} employeeInformation.employeeNumber - The employee number
 * @param {number} employeeInformation.yearlyHolidays - The yearly holidays
 * @param {number} employeeInformation.carriedOverHolidays - The carried over holidays
 * @param {Object} options - The options for the request
 * @param {string} options.cache - The cache mode for the request
 * @returns {Promise<Object>} The holidays
 */
export async function getHolidays(employeeInformation, options = { cache: 'no-store' }) {
    const { employeeNumber, yearlyHolidays, carriedOverHolidays } = employeeInformation;
    try {
        const flexApiClient = await getFlexApiService();
        flexApiClient.config.cache = options.cache;

        const response = await flexApiClient.getAbsenceApplications(
            employeeNumber,
            HOLIDAY_TYPE_ID,
            30
        );

        if (!response?.Result) {
            throw new NoResultsError('No holidays found');
        }

        const holidays = calculateHolidays(response.Result);

        holidays.totalHolidays = yearlyHolidays + (carriedOverHolidays || 0); // Potentially get from flex
        holidays.availableHolidays = holidays.totalHolidays - holidays.currentFiscalUsedHolidays;
        holidays.carriedOverHolidays = carriedOverHolidays;

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
 * Get the holiday requests for a given employee number. Only future requests are returned.
 * @param {string} employeeNumber - The employee number
 * @param {string} currentDate - The current date
 * @returns {Promise<Object>} The holiday requests
 */
export async function getHolidayRequests(employeeNumber, currentDate) {
    try {
        const flexApiClient = await getFlexApiService();
        const response = await flexApiClient.getAbsenceApplications(
            employeeNumber,
            HOLIDAY_TYPE_ID
        );

        const currentDateISO = formatDateToISOString(currentDate);

        const filteredResponse = response.Result.filter(
            (request) => formatDateToISOString(request.FromDate) >= currentDateISO
        ).map((request) => ({
            ...request,
            status: ABSENCE_STATUS_CODE[request.CurrentStatus.Status],
        }));

        return filteredResponse || [];
    } catch (error) {
        throw error;
    }
}

// @TODO: IMPLEMENT THIS: IF THERE ARE NOT SICK LEAVES, THE API RETURNS 404 -> IMPLEMENT THIS
export async function getSickLeaveRequests(employeeNumber, currentDate) {
    try {
        const flexApiClient = await getFlexApiService();
        return await flexApiClient.getAbsenceApplications(employeeNumber, SICK_LEAVE_TYPE_ID);
    } catch (error) {
        throw error;
    }
}

/**
 * Create an absence application for a given employee number
 * @param {string} employmentNumber - The employee number
 * @param {string} absenceApplicationType - The type of absence application
 * @param {Object} absenceApplicationData - The data for the absence application
 * @returns {Promise<Object>} The absence application
 */
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

/**
 * Create a holiday absence application for a given employee number
 * @param {string} employmentNumber - The employee number
 * @param {Object} absenceApplicationData - The data for the absence application
 * @returns {Promise<Object>} The absence application
 */
async function createHolidayAbsenceApplication(employmentNumber, absenceApplicationData) {
    try {
        const absenceApplicationPayload = {
            absenceTypeId: HOLIDAY_TYPE_ID,
            companyId: COMPANY_ID,
            employmentNumber: employmentNumber,
            fromDate: absenceApplicationData.startDate,
            toDate: absenceApplicationData.endDate,
            ...(absenceApplicationData.isSameDay && { hours: absenceApplicationData.hours }),
        };

        const flexApiClient = await getFlexApiService();
        return await flexApiClient.createAbsenceApplication(
            employmentNumber,
            absenceApplicationPayload
        );
    } catch (error) {
        throw error;
    }
}

/**
 * Update an absence request
 * @param {string} absenceApplicationType - The type of absence application
 * @param {string} absenceRequestId - The ID of the absence request to update
 * @param {string} employmentNumber - The employee number
 * @param {Object} absenceApplicationData - The data for the absence application
 * @param {string} absenceApplicationData.FromDate - The new from date (YYYY-MM-DD)
 * @param {string} absenceApplicationData.ToDate - The new to date (YYYY-MM-DD)
 * @param {number|null} absenceApplicationData.Hours - The hours (only for same-day requests)
 */
export async function updateAbsenceRequest(
    absenceApplicationType,
    absenceRequestId,
    employmentNumber,
    absenceApplicationData
) {
    try {
        switch (absenceApplicationType) {
            case 'holiday-absence-request':
                return updateHolidayAbsenceApplication(
                    absenceRequestId,
                    employmentNumber,
                    absenceApplicationData
                );
            default:
                throw new Error('Invalid absence application type');
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Update a holiday absence application for a given employee number
 * @param {string} absenceRequestId - The ID of the absence request to update
 * @param {string} employmentNumber - The employee number
 * @param {Object} absenceApplicationData - The data for the absence application
 * @returns {Promise<Object>} The updated absence application
 */
async function updateHolidayAbsenceApplication(
    absenceRequestId,
    employmentNumber,
    absenceApplicationData
) {
    try {
        const payload = {
            fromDate: absenceApplicationData.FromDate,
            toDate: absenceApplicationData.ToDate,
            employmentNumber: employmentNumber,
            absenceTypeId: HOLIDAY_TYPE_ID,
            companyId: COMPANY_ID,
        };

        const flexApiClient = await getFlexApiService();
        return await flexApiClient.updateAbsenceApplication(absenceRequestId, payload);
    } catch (error) {
        throw error;
    }
}

/**
 * Delete an absence request
 * @param {string} absenceRequestId - The ID of the absence request to delete
 * @returns {Promise<Object>} The deleted absence request
 */
export async function deleteAbsenceRequest(absenceRequestId) {
    try {
        const flexApiClient = await getFlexApiService();
        return await flexApiClient.deleteAbsenceApplication(absenceRequestId);
    } catch (error) {
        throw error;
    }
}

/**
 * Utils methods
 */
/**
 * Converts decimal hours to "HH:MM" time format string.
 * Examples:
 *   0 -> "00:00"
 *   1 -> "01:00"
 *   1.5 -> "01:30"
 *   2.5 -> "02:30"
 *   10.5 -> "10:30"
 * @param {number} decimalHours - The decimal hours to convert
 * @returns {string} The time string in "HH:MM" format
 */
function hoursToTimeString(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
