"use server";

import { NoResultsError, NetworkError, ApiError } from "../callouts/errors.js";
import {
  calculateHolidays,
  calculateNextResetDate,
  generateDateRange,
} from "@/lib/utils.js";
import { getFlexApiService } from "./flex-service.js";

export async function getAbsenceApplications(employeeNumber, options = { cache: 'force-cache' }) {
  try {
    const flexApiClient = await getFlexApiService();
    flexApiClient.config.cache = options.cache;
    
    const response = await flexApiClient.getAbsenceApplications(employeeNumber);

    if (!response?.Result) {
      throw new NoResultsError("No holidays found");
    }

    const holidays = calculateHolidays(response.Result);

    holidays.totalHolidays = 30; // Potentially get from flex
    holidays.availableHolidays =
      holidays.totalHolidays - holidays.currentFiscalUsedHolidays;
    holidays.recentHolidayPeriods = holidays.holidayPeriods.slice(0, 3);
    holidays.nextResetDate = calculateNextResetDate(new Date());
    holidays.allHolidaysRange = [];

    for (const holiday of holidays.holidayPeriods) {
      holidays.allHolidaysRange.push(...generateDateRange(
        holiday.fromDate,
        holiday.toDate
      ));
    }

    return holidays;
  } catch (error) {
    console.error("Error in getAbsenceApplications:", {
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
      error.message || "Failed to fetch absence applications",
      error.status,
      error.code
    );
  }
}
