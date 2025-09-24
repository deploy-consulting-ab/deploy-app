import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HOLIDAY_TYPE_ID, isSwedishBankHoliday } from '@/actions/flex/constants';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const formatDateToSwedish = (date) => {
    return new Date(date).toLocaleDateString('sv-SE');
};

export const formatDateToEnUSWithOptions = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });
};

export const formatDateToISOString = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

export const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
};

/**
 * Calculates total holidays and current fiscal year holidays from absence data
 * @param {Array} absenceData - Array of absence entries
 * @returns {Object} Object containing total days and fiscal year days
 */
export const calculateHolidays = (absenceData) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const HOLIDAY_FISCAL_YEAR_START = new Date(currentYear, 3, 1); // April 1st
    const HOLIDAY_FISCAL_YEAR_END = new Date(currentYear + 1, 2, 31); // March 31st next year

    /**
     * Subfunction to check if date is in current fiscal year
     */
    const isCurrentFiscalYear = (date) => {
        return date >= HOLIDAY_FISCAL_YEAR_START && date <= HOLIDAY_FISCAL_YEAR_END;
    };

    // Filter only holiday entries
    const holidayEntries = absenceData.filter((entry) => entry.AbsenceTypeId === HOLIDAY_TYPE_ID);

    // Calculate days for each period
    let currentFiscalUsedHolidays = 0;

    const holidayPeriods = holidayEntries.map((entry) => {
        // Create Date objects and set to 14:00 to avoid timezone issues
        const fromDate = new Date(entry.FromDate);
        fromDate.setHours(14, 0, 0, 0);

        const toDate = new Date(entry.ToDate);
        toDate.setHours(14, 0, 0, 0);

        let currentFiscalPeriodUsedHolidays = 0;
        let currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
            // Check date is in current fiscal year, is not a weekend and not a bank holiday
            if (
                isCurrentFiscalYear(currentDate) &&
                !isWeekend(currentDate) &&
                !isSwedishBankHoliday(currentDate)
            ) {
                currentFiscalUsedHolidays++;
                currentFiscalPeriodUsedHolidays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
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
            isCurrentFiscalYear:
                period.fromDate >= HOLIDAY_FISCAL_YEAR_START &&
                period.toDate <= HOLIDAY_FISCAL_YEAR_END,
        })),
    };
};

/**
 * Calculate the next reset date for the holiday allowance
 * @param {Date} today - The current date
 * @returns {Date} The next reset date
 */
export const calculateNextResetDate = (today) => {
    const currentYear = today.getFullYear();
    const nextApril = new Date(currentYear, 3, 1); // Month is 0-based, so 3 = April

    if (today >= nextApril) {
        // If we're past April 1st this year, set to next year's April 1st
        return new Date(currentYear + 1, 3, 1);
    } else {
        return nextApril;
    }
};

/**
 * Generate a list of dates between two dates
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Array} An array of dates
 */
export const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let date = new Date(startDate); // Create a new Date object
    while (date <= endDate) {
        if (!isWeekend(date)) {
            dates.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

/**
 * Get the fiscal year for a given date
 * @param {Date} date - The date to get the fiscal year for
 * @returns {number} The fiscal year
 */
export const getFiscalYear = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    // If the month is January (0), it belongs to the previous fiscal year
    return month === 0 ? year - 1 : year;
};

/**
 * Get the start date of a fiscal year
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The start date of the fiscal year (February 1st)
 */
export const getFiscalYearStart = (fiscalYear) => {
    return new Date(fiscalYear, 1, 1); // February 1st
};

/**
 * Get the end date of a fiscal year
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The end date of the fiscal year (January 31st of next year)
 */
export const getFiscalYearEnd = (fiscalYear) => {
    return new Date(fiscalYear + 1, 0, 31); // January 31st of next year
};

/**
 * Check if a date falls within a specific fiscal year
 * @param {Date} date - The date to check
 * @param {number} fiscalYear - The fiscal year to check against
 * @returns {boolean} Whether the date falls within the fiscal year
 */
export const isInFiscalYear = (date, fiscalYear) => {
    const start = getFiscalYearStart(fiscalYear);
    const end = getFiscalYearEnd(fiscalYear);
    return date >= start && date <= end;
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
 * Get the current fiscal year based on a date
 * Fiscal year runs from February 1st to January 31st
 * @param {Date} [date=new Date()] - The date to get the fiscal year for
 * @returns {number} The fiscal year
 */
export const getCurrentFiscalYear = (date = new Date()) => {
    const month = date.getMonth(); // 0-based: January = 0, February = 1, etc.
    const year = date.getFullYear();

    // If we're in January (0), we're in the previous fiscal year
    if (month === 0) {
        return year - 1;
    }

    return year;
};

/**
 * Get the previous fiscal year based on a date
 * @param {Date} [date=new Date()] - The date to get the previous fiscal year for
 * @returns {number} The previous fiscal year
 */
export const getPreviousFiscalYear = (date = new Date()) => {
    return getCurrentFiscalYear(date) - 1;
};

/**
 * Get the start date of a specific fiscal year
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The start date (February 1st of the fiscal year)
 */
export const getFiscalYearStartDate = (fiscalYear) => {
    return new Date(fiscalYear, 1, 1); // February 1st
};

/**
 * Get the end date of a specific fiscal year
 * @param {number} fiscalYear - The fiscal year
 * @returns {Date} The end date (January 31st of the next year)
 */
export const getFiscalYearEndDate = (fiscalYear) => {
    return new Date(fiscalYear + 1, 0, 31); // January 31st of next year
};
