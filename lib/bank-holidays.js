/**
 * Depreacted, auto-calculation of bank holidays
 */

/**
 * Helper function to create a Date object with a consistent time (noon) to avoid timezone issues
 * @param {number} year
 * @param {number} month - 0-based month (0-11)
 * @param {number} day
 * @returns {Date}
 */
const createHolidayDate = (year, month, day) => {
  const date = new Date(year, month, day);
  date.setHours(12, 0, 0, 0);
  return date;
};

/**
 * Helper function to format a date to ISO string date part only
 * @param {Date} date
 * @returns {string}
 */
const formatDateKey = (date) => {
  return date.toISOString().split("T")[0];
};

/**
 * Creates a Set of Swedish bank holidays for the specified year
 * @param {number} year
 * @returns {Set<string>}
 */
const getSwedishHolidaysForYear = (year) => {
  const holidays = new Set();

  // Fixed holidays
  holidays.add(formatDateKey(createHolidayDate(year, 0, 1))); // New Year's Day
  holidays.add(formatDateKey(createHolidayDate(year, 0, 6))); // Epiphany
  holidays.add(formatDateKey(createHolidayDate(year, 4, 1))); // Labour Day
  holidays.add(formatDateKey(createHolidayDate(year, 5, 6))); // National Day
  holidays.add(formatDateKey(createHolidayDate(year, 11, 25))); // Christmas Day
  holidays.add(formatDateKey(createHolidayDate(year, 11, 26))); // Boxing Day

  // Calculate Easter Sunday for the year
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easterSunday = createHolidayDate(year, month, day);
  const goodFriday = new Date(easterSunday);
  goodFriday.setDate(easterSunday.getDate() - 2);
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterSunday.getDate() + 1);
  const ascensionDay = new Date(easterSunday);
  ascensionDay.setDate(easterSunday.getDate() + 39);
  const pentecostSunday = new Date(easterSunday);
  pentecostSunday.setDate(easterSunday.getDate() + 49);
  const midsummerEve = new Date(
    year,
    5,
    19 + ((5 - new Date(year, 5, 19).getDay() + 7) % 7)
  );
  const midsummerDay = new Date(midsummerEve);
  midsummerDay.setDate(midsummerEve.getDate() + 1);

  // Add movable holidays
  holidays.add(formatDateKey(goodFriday));
  holidays.add(formatDateKey(easterMonday));
  holidays.add(formatDateKey(ascensionDay));
  holidays.add(formatDateKey(midsummerEve));
  holidays.add(formatDateKey(midsummerDay));

  return holidays;
};

// Create a Set with all Swedish bank holidays from 2024 to 2030
const swedishBankHolidays = new Set();
for (let year = 2024; year <= 2030; year++) {
  const yearHolidays = getSwedishHolidaysForYear(year);
  yearHolidays.forEach((holiday) => swedishBankHolidays.add(holiday));
}

/**
 * Checks if a given date is a Swedish bank holiday
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is a Swedish bank holiday
 */
export const isSwedishBankHoliday = (date) => {
  const dateKey = formatDateKey(date);
  return swedishBankHolidays.has(dateKey);
};

// Export the Set for testing or other uses
export const allSwedishBankHolidays = swedishBankHolidays;
