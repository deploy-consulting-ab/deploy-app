'use server';

import { requireAuth } from '@/lib/require-auth';

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
    await requireAuth();
    try {
        return await getTimereportCheckmark(userId, weekStartDate);
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
    await requireAuth();
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
    await requireAuth();
    try {
        // Ensure weekStartDate is a Date object
        const dateObj = new Date(weekStartDate);
        return await deleteTimereportCheckmark(userId, dateObj);
    } catch (error) {
        throw error;
    }
}
