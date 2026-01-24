import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MONTHS, SWEDISH_BANK_HOLIDAYS, ABSENCE_STATUS_TYPE_TEXT } from '@/actions/flex/constants';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Helper function to format a date to ISO string date part only.
 * This ensures consistent string representation of dates for Set comparison.
 * Uses UTC methods to avoid timezone issues.
 *
 * @param {Date} date - Date object to format
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
const formatDateKey = (date) => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date is a Swedish bank holiday.
 * This function provides O(1) lookup time using a pre-calculated Set of holiday dates.
 * The current implementation covers holidays from 2024 to 2030.
 *
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is a Swedish bank holiday
 * @example
 * // Check if Christmas 2024 is a holiday
 * isSwedishBankHoliday(new Date('2024-12-25')) // Returns true
 *
 * // Check if a regular weekday is a holiday
 * isSwedishBankHoliday(new Date('2024-03-12')) // Returns false
 */
export const isSwedishBankHoliday = (date) => {
    const dateKey = formatDateKey(date);
    return SWEDISH_BANK_HOLIDAYS.has(dateKey);
};

/**
 * Checks if a date is in a holidays Set
 * @param {Date} date - The date to check
 * @param {Set} holidays - Set of holiday date strings (YYYY-MM-DD format)
 * @returns {boolean} True if the date is a holiday
 */
export const isHolidayDate = (date, holidays) => {
    if (!holidays || holidays.size === 0) return false;
    return holidays.has(formatDateToISOString(date));
};

export const formatDateToSwedish = (dateInput) => {
    // Handle both Date objects and date strings
    let dateString = '';
    if (dateInput instanceof Date) {
        dateString = formatDateToISOString(dateInput);
    } else {
        dateString = dateInput;
    }

    // Parse YYYY-MM-DD format and return in Swedish format (YYYY-MM-DD)
    const [year, month, day] = dateString.split('-').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const formatDateToEnUSWithOptions = (dateInput) => {
    let dateString = '';
    if (dateInput instanceof Date) {
        dateString = formatDateToISOString(dateInput);
    } else {
        dateString = dateInput;
    }

    // Parse YYYY-MM-DD format and return in English format (Month Day, Year)
    const [year, month, day] = dateString.split('-').map(Number);
    return `${MONTHS[month - 1]} ${String(day).padStart(2, '0')}, ${year}`;
};

/**
 * Get today's date as a UTC Date object (midnight UTC).
 * Use this on the server to avoid timezone issues with Vercel (UTC) vs local development.
 * @returns {Date} Today's date at midnight UTC
 */
export const getUTCToday = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

/**
 * Format a date to ISO string date part only (YYYY-MM-DD).
 * Uses UTC methods to ensure consistent results regardless of server timezone.
 *
 * IMPORTANT: If a date string without timezone is passed (e.g., '2025-12-23T00:00:00'),
 * we extract the date part directly to avoid local timezone interpretation issues.
 *
 * @param {Date|string} date - Date object or date string to format
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export const formatDateToISOString = (date) => {
    // If it's a string, try to extract date part directly to avoid timezone issues
    if (typeof date === 'string') {
        // Match YYYY-MM-DD at the start of the string (handles both '2025-12-23' and '2025-12-23T00:00:00')
        const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) {
            return match[1];
        }
    }

    // For Date objects, use UTC methods
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Check if a date falls on a weekend (Saturday or Sunday).
 * Uses UTC methods for server-side consistency.
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if weekend
 */
export const isWeekend = (date) => {
    const d = new Date(date);
    const day = d.getUTCDay();
    return day === 0 || day === 6;
};

/**
 * Get the Monday of the week containing the given date.
 * Uses UTC methods to ensure consistent results regardless of server timezone.
 * @param {Date|string} date - The date to get the Monday for
 * @returns {Date} The Monday of the week (at midnight UTC)
 */
export const getWeekMonday = (date) => {
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setUTCDate(d.getUTCDate() + diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

/**
 * Get the Sunday of the week containing the given date.
 * Uses UTC methods to ensure consistent results regardless of server timezone.
 * @param {Date|string} date - The date to get the Sunday for
 * @returns {Date} The Sunday of the week (at midnight UTC)
 */
export const getWeekSunday = (date) => {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + 6);
    d.setUTCHours(23, 59, 59, 999);
    return d;
};

/**
 * Format date to short display format (e.g., "24 Dec").
 * Uses UTC methods for consistency.
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateDayMonth = (date) => {
    const d = new Date(date);
    const day = d.getUTCDate();
    const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
    return `${day} ${month}`;
};

/**
 * Get ISO week number of the year
 * @param {Date} date - The date to get the week number for
 * @returns {number} The week number
 */
export const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

/**
 * Calculates total holidays and current fiscal year holidays from absence data
 * Uses UTC methods for consistent date handling across timezones.
 * @param {Array} holidayEntries - Array of holiday entries
 * @returns {Object} Object containing total days and fiscal year days
 */
export const calculateHolidays = (holidayEntries) => {
    const now = getUTCToday();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    // Fiscal year runs from April 1st to March 31st
    // If current month is Jan-Mar (0-2), we're in the fiscal year that started last year
    // If current month is Apr-Dec (3-11), we're in the fiscal year that started this year
    const fiscalYearStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;

    const HOLIDAY_FISCAL_YEAR_START = new Date(Date.UTC(fiscalYearStartYear, 3, 1)); // April 1st UTC
    const HOLIDAY_FISCAL_YEAR_END = new Date(Date.UTC(fiscalYearStartYear + 1, 2, 31)); // March 31st next year UTC

    /**
     * Subfunction to check if date is in current fiscal year
     */
    const isCurrentHolidaysFiscalYear = (date) => {
        return date >= HOLIDAY_FISCAL_YEAR_START && date <= HOLIDAY_FISCAL_YEAR_END;
    };

    // Calculate days for each period
    let currentFiscalUsedHolidays = 0;

    const holidayPeriods = holidayEntries.map((entry) => {
        // Parse dates as UTC to avoid timezone-related shifts
        // The API returns dates like '2025-10-20T00:00:00' (no timezone indicator)
        // Append 'Z' to treat as UTC instead of local time
        const fromDate = new Date(entry.FromDate + 'Z');
        const toDate = new Date(entry.ToDate + 'Z');

        let currentFiscalPeriodUsedHolidays = 0;
        let currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
            // Check date is in current fiscal year, is not a weekend and not a bank holiday
            if (!isWeekend(currentDate) && !isSwedishBankHoliday(currentDate)) {
                currentFiscalPeriodUsedHolidays++;

                if (isCurrentHolidaysFiscalYear(currentDate)) {
                    currentFiscalUsedHolidays++;
                }
            }
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        return {
            fromDate,
            toDate,
            days: currentFiscalPeriodUsedHolidays,
            message: entry.Message,
        };
    });

    return {
        currentFiscalUsedHolidays: currentFiscalUsedHolidays,
        holidayPeriods: holidayPeriods.map((period) => ({
            fromDate: period.fromDate,
            toDate: period.toDate,
            days: period.days,
            message: period.message,
            isCurrentHolidaysFiscalYear:
                period.fromDate >= HOLIDAY_FISCAL_YEAR_START &&
                period.toDate <= HOLIDAY_FISCAL_YEAR_END,
        })),
    };
};

/**
 * Calculate the next reset date for the holiday allowance.
 * Uses UTC methods for consistent date handling.
 * @param {Date} today - The current date
 * @returns {Date} The next reset date (at midnight UTC)
 */
export const calculateNextResetDate = (today) => {
    const d = new Date(today);
    const currentYear = d.getUTCFullYear();
    const nextApril = new Date(Date.UTC(currentYear, 3, 1)); // Month is 0-based, so 3 = April

    if (d >= nextApril) {
        // If we're past April 1st this year, set to next year's April 1st
        return new Date(Date.UTC(currentYear + 1, 3, 1));
    } else {
        return nextApril;
    }
};

/**
 * Generate a list of dates between two dates.
 * Uses UTC methods for consistent date handling.
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Array} An array of dates (at noon UTC to avoid edge cases)
 */
export const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const date = new Date(startDate);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC to avoid edge cases
    const end = new Date(endDate);
    end.setUTCHours(12, 0, 0, 0);

    while (date <= end) {
        if (!isWeekend(date)) {
            dates.push(new Date(date));
        }
        date.setUTCDate(date.getUTCDate() + 1);
    }
    return dates;
};

/**
 * Get the fiscal year for a given date.
 * Uses UTC methods for consistent date handling.
 * @param {Date|string} date - The date to get the fiscal year for
 * @returns {number} The fiscal year
 */
export const getFiscalYear = (date) => {
    const d = new Date(date);
    const month = d.getUTCMonth();
    const year = d.getUTCFullYear();
    // If the month is January (0), it belongs to the previous fiscal year
    return month === 0 ? year - 1 : year;
};

/**
 * Get the start date of a fiscal year.
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The start date of the fiscal year (February 1st at midnight UTC)
 */
export const getFiscalYearStart = (fiscalYear) => {
    return new Date(Date.UTC(fiscalYear, 1, 1)); // February 1st UTC
};

/**
 * Get the end date of a fiscal year.
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The end date of the fiscal year (January 31st of next year at midnight UTC)
 */
export const getFiscalYearEnd = (fiscalYear) => {
    return new Date(Date.UTC(fiscalYear + 1, 0, 31)); // January 31st of next year UTC
};

/**
 * Check if a date falls within a specific fiscal year.
 * @param {Date|string} date - The date to check
 * @param {number} fiscalYear - The fiscal year to check against
 * @returns {boolean} Whether the date falls within the fiscal year
 */
export const isInFiscalYear = (date, fiscalYear) => {
    const d = new Date(date);
    const start = getFiscalYearStart(fiscalYear);
    const end = getFiscalYearEnd(fiscalYear);
    return d >= start && d <= end;
};

export const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Mobile|Android|iPhone/i.test(window.navigator.userAgent);
};

export const getAssignmentStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
        case 'ongoing':
            return 'bg-deploy-blue';
        case 'completed':
            return 'bg-deploy-teal';
        case 'not started':
            return 'bg-gray-500';
        default:
            return 'bg-gray-500';
    }
};

export const getOpportunityStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
        case 'qualification':
            return 'bg-deploy-ocean';
        case 'discovery':
            return 'bg-deploy-ocean';
        case 'engagement scoping':
            return 'bg-deploy-purple';
        case 'engagement proposal':
            return 'bg-deploy-purple';
        case 'negotiation':
            return 'bg-deploy-blue';
        default:
            return 'bg-gray-500';
    }
};

/**
 * Get the current fiscal year based on a date.
 * Fiscal year runs from February 1st to January 31st.
 * Uses UTC methods for consistent date handling.
 * @param {Date} [date] - The date to get the fiscal year for (defaults to UTC today)
 * @returns {number} The fiscal year
 */
export const getCurrentFiscalYear = (date) => {
    const d = date ? new Date(date) : getUTCToday();
    const month = d.getUTCMonth(); // 0-based: January = 0, February = 1, etc.
    const year = d.getUTCFullYear();

    // If we're in January (0), we're in the previous fiscal year
    if (month === 0) {
        return year - 1;
    }

    return year;
};

/**
 * Get the previous fiscal year based on a date.
 * Uses UTC methods for consistent date handling.
 * @param {Date} [date] - The date to get the previous fiscal year for (defaults to UTC today)
 * @returns {number} The previous fiscal year
 */
export const getPreviousFiscalYear = (date) => {
    return getCurrentFiscalYear(date) - 1;
};

/**
 * Get the start date of a specific fiscal year.
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The start date (February 1st of the fiscal year at midnight UTC)
 */
export const getFiscalYearStartDate = (fiscalYear) => {
    return new Date(Date.UTC(fiscalYear, 1, 1)); // February 1st UTC
};

/**
 * Get the end date of a specific fiscal year.
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The end date (January 31st of the next year at midnight UTC)
 */
export const getFiscalYearEndDate = (fiscalYear) => {
    return new Date(Date.UTC(fiscalYear + 1, 0, 31)); // January 31st of next year UTC
};

/**
 * Transform raw holidays data from API to match HolidaysCard expected format.
 * @param {Object} rawData - Raw holidays data from getHolidays
 * @returns {Object|null} Transformed holidays data for HolidaysCard component
 */
export const transformHolidaysData = (rawData) => {
    if (!rawData) return null;

    return {
        availableDays: rawData.availableHolidays ?? 0,
        totalDays: rawData.totalHolidays ?? 0,
        usedDays: rawData.currentFiscalUsedHolidays ?? 0,
        nextResetDate: rawData.nextResetDate ?? null,
        upcomingHolidays:
            rawData.recentHolidayPeriods?.map((period) => ({
                date: period.fromDate,
                endDate: period.toDate,
                days: period.days,
                name: `${period.days} day${period.days > 1 ? 's' : ''} off`,
            })) ?? [],
    };
};

export const populateSystemPermissions = (entitySystemPermissions, totalSystemPermissions) => {
    const systemPermissions = [];

    const entitySystemPermissionsSet = new Set(
        entitySystemPermissions.map((systemPermission) => systemPermission.name)
    );

    for (const systemPermission of totalSystemPermissions) {
        if (entitySystemPermissionsSet.has(systemPermission.name)) {
            systemPermissions.push({
                ...systemPermission,
                assigned: true,
            });
        } else {
            systemPermissions.push({
                ...systemPermission,
                assigned: false,
            });
        }
    }

    systemPermissions.sort((a, b) => (a.assigned ? -1 : 1));

    return systemPermissions;
};

export const getAbsenceStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'registered':
            return 'bg-gray-500';
        case 'applied for':
            return 'bg-blue-500';
        case 'audited':
            return 'bg-green-500';
        case 'rejected':
            return 'bg-red-500';
    }
};

    export const getAbsenceStatusText = (absenceTypeId) => {
    console.log('### absenceTypeText', ABSENCE_STATUS_TYPE_TEXT[absenceTypeId]);
    return ABSENCE_STATUS_TYPE_TEXT[absenceTypeId] || 'Unknown';
};
