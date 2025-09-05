export const HOLIDAY_TYPE_ID = '948b233d-892e-4d98-9841-0f14a2e55597';

/**
 * Pre-calculated Set of all Swedish bank holidays from 2024 to 2030.
 * Each date is stored as an ISO date string (YYYY-MM-DD).
 * This Set provides O(1) lookup time for holiday checks.
 *
 * Includes:
 * Fixed holidays:
 * - New Year's Day (January 1)
 * - Epiphany (January 6)
 * - Labour Day (May 1)
 * - National Day (June 6)
 * - Christmas Eve (December 24)
 * - Christmas Day (December 25)
 * - Boxing Day (December 26)
 * - New Year's Eve (December 31)
 *
 * Movable holidays:
 * - Good Friday (2 days before Easter Sunday)
 * - Easter Monday (day after Easter Sunday)
 * - Ascension Day (39 days after Easter Sunday)
 * - Midsummer Eve (Friday between June 19-25)
 * - Midsummer Day (Saturday between June 20-26)
 *
 * @type {Set<string>}
 */
export const SWEDISH_BANK_HOLIDAYS = new Set([
    // 2024
    '2024-01-01',
    '2024-01-06',
    '2024-03-29',
    '2024-04-01',
    '2024-05-01',
    '2024-05-09',
    '2024-06-06',
    '2024-06-21',
    '2024-06-22',
    '2024-12-24',
    '2024-12-25',
    '2024-12-26',
    '2024-12-31',

    // 2025
    '2025-01-01',
    '2025-01-06',
    '2025-04-18',
    '2025-04-21',
    '2025-05-01',
    '2025-05-29',
    '2025-06-06',
    '2025-06-20',
    '2025-06-21',
    '2025-12-24',
    '2025-12-25',
    '2025-12-26',
    '2025-12-31',

    // 2026
    '2026-01-01',
    '2026-01-06',
    '2026-04-03',
    '2026-04-06',
    '2026-05-01',
    '2026-05-14',
    '2026-06-06',
    '2026-06-19',
    '2026-06-20',
    '2026-12-24',
    '2026-12-25',
    '2026-12-26',
    '2026-12-31',

    // 2027
    '2027-01-01',
    '2027-01-06',
    '2027-03-26',
    '2027-03-29',
    '2027-05-01',
    '2027-05-06',
    '2027-06-06',
    '2027-06-25',
    '2027-06-26',
    '2027-12-24',
    '2027-12-25',
    '2027-12-26',
    '2027-12-31',

    // 2028
    '2028-01-01',
    '2028-01-06',
    '2028-04-14',
    '2028-04-17',
    '2028-05-01',
    '2028-05-25',
    '2028-06-06',
    '2028-06-23',
    '2028-06-24',
    '2028-12-24',
    '2028-12-25',
    '2028-12-26',
    '2028-12-31',

    // 2029
    '2029-01-01',
    '2029-01-06',
    '2029-03-30',
    '2029-04-02',
    '2029-05-01',
    '2029-05-10',
    '2029-06-06',
    '2029-06-22',
    '2029-06-23',
    '2029-12-24',
    '2029-12-25',
    '2029-12-26',
    '2029-12-31',

    // 2030
    '2030-01-01',
    '2030-01-06',
    '2030-04-19',
    '2030-04-22',
    '2030-05-01',
    '2030-05-30',
    '2030-06-06',
    '2030-06-21',
    '2030-06-22',
    '2030-12-24',
    '2030-12-25',
    '2030-12-26',
    '2030-12-31',
]);

/**
 * Helper function to format a date to ISO string date part only.
 * This ensures consistent string representation of dates for Set comparison.
 *
 * @param {Date} date - Date object to format
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
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
