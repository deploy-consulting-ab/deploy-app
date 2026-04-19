import { db } from '@/lib/db';

/**
 * Get all financial records, ordered by fiscal year and quarter.
 * @returns {Promise<FinancialRecord[]>}
 */
export async function getFinancials() {
    try {
        return await db.financialRecord.findMany({
            orderBy: [{ fiscalYear: 'desc' }, { quarter: 'asc' }],
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Get financial records for a specific fiscal year.
 * @param {number} fiscalYear
 * @returns {Promise<FinancialRecord[]>}
 */
export async function getFinancialsByFiscalYear(fiscalYear) {
    try {
        return await db.financialRecord.findMany({
            where: { fiscalYear },
            orderBy: { quarter: 'asc' },
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Create a financial record.
 * @param {Object} data
 * @returns {Promise<FinancialRecord>}
 */
export async function createFinancialRecord(data) {
    try {
        return await db.financialRecord.create({ data });
    } catch (error) {
        throw error;
    }
}

/**
 * Update a financial record by id.
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<FinancialRecord>}
 */
export async function updateFinancialRecord(id, data) {
    try {
        return await db.financialRecord.update({ where: { id }, data });
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a financial record by id.
 * @param {string} id
 * @returns {Promise<FinancialRecord>}
 */
export async function deleteFinancialRecord(id) {
    try {
        return await db.financialRecord.delete({ where: { id } });
    } catch (error) {
        throw error;
    }
}
