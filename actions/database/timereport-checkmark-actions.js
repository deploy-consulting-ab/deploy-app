'use server';

import {
    getTimereportCheckmark,
    getTimereportCheckmarksByUser,
    createTimereportCheckmark,
    deleteTimereportCheckmark,
} from '@/data/timereport-checkmark-db';

/**
 * Get a timereport checkmark for a user and week
 * @param {string} userId
 * @param {Date} weekStartDate - The Monday of the week
 * @returns {Promise<TimereportCheckmark|null>} The checkmark if found, null otherwise
 * @throws {Error} If the query fails
 */
export async function getTimereportCheckmarkAction(userId, weekStartDate) {
    try {
        return await getTimereportCheckmark(userId, weekStartDate);
    } catch (error) {
        throw error;
    }
}

/**
 * Get all timereport checkmarks for a user
 * @param {string} userId
 * @returns {Promise<TimereportCheckmark[]>} All checkmarks for the user
 * @throws {Error} If the query fails
 */
export async function getTimereportCheckmarksByUserAction(userId) {
    try {
        return await getTimereportCheckmarksByUser(userId);
    } catch (error) {
        throw error;
    }
}

/**
 * Create a timereport checkmark
 * @param {string} userId
 * @param {Date} weekStartDate - The Monday of the week
 * @returns {Promise<TimereportCheckmark>} The created checkmark
 * @throws {Error} If the creation fails
 */
export async function createTimereportCheckmarkAction(userId, weekStartDate) {
    try {
        // Ensure weekStartDate is a Date object
        const dateObj = new Date(weekStartDate);
        return await createTimereportCheckmark(userId, dateObj);
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a timereport checkmark
 * @param {string} userId
 * @param {Date} weekStartDate - The Monday of the week
 * @returns {Promise<TimereportCheckmark>} The deleted checkmark
 * @throws {Error} If the deletion fails
 */
export async function deleteTimereportCheckmarkAction(userId, weekStartDate) {
    try {
        // Ensure weekStartDate is a Date object
        const dateObj = new Date(weekStartDate);
        return await deleteTimereportCheckmark(userId, dateObj);
    } catch (error) {
        throw error;
    }
}
