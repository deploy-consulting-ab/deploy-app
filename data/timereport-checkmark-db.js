import { db } from '@/lib/db';

/**
 * GET METHODS
 */

/**
 * Get a timereport checkmark for a user and week
 * @param {string} userId
 * @param {Date} weekStartDate - The Monday of the week
 * @returns {Promise<TimereportCheckmark|null>} The checkmark if found, null otherwise
 * @throws {Error} If the query fails
 */
export const getTimereportCheckmark = async (userId, weekStartDate) => {
    try {
        const checkmark = await db.timereportCheckmark.findUnique({
            where: {
                userId_weekStartDate: {
                    userId,
                    weekStartDate,
                },
            },
        });
        return checkmark;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all timereport checkmarks for a user
 * @param {string} userId
 * @returns {Promise<TimereportCheckmark[]>} All checkmarks for the user
 * @throws {Error} If the query fails
 */
export const getTimereportCheckmarksByUser = async (userId) => {
    try {
        const checkmarks = await db.timereportCheckmark.findMany({
            where: { userId },
            orderBy: { weekStartDate: 'desc' },
        });
        return checkmarks;
    } catch (error) {
        throw error;
    }
};

/**
 * CREATE METHODS
 */

/**
 * Create a timereport checkmark
 * @param {string} userId
 * @param {Date} weekStartDate - The Monday of the week
 * @returns {Promise<TimereportCheckmark>} The created checkmark
 * @throws {Error} If the creation fails
 */
export const createTimereportCheckmark = async (userId, weekStartDate) => {
    try {
        const checkmark = await db.timereportCheckmark.create({
            data: {
                userId,
                weekStartDate,
            },
        });
        return checkmark;
    } catch (error) {
        throw error;
    }
};

/**
 * DELETE METHODS
 */

/**
 * Delete a timereport checkmark
 * @param {string} userId
 * @param {Date} weekStartDate - The Monday of the week
 * @returns {Promise<TimereportCheckmark>} The deleted checkmark
 * @throws {Error} If the deletion fails
 */
export const deleteTimereportCheckmark = async (userId, weekStartDate) => {
    try {
        const checkmark = await db.timereportCheckmark.delete({
            where: {
                userId_weekStartDate: {
                    userId,
                    weekStartDate,
                },
            },
        });
        return checkmark;
    } catch (error) {
        throw error;
    }
};
