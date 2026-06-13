'use server';

import { requireAuth } from '@/lib/require-auth';

import { CreateFinancialRecordSchema, UpdateFinancialRecordSchema } from '@/schemas';
import {
    getFinancials,
    createFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
} from '@/data/financials-db';

/**
 * Get all financial records.
 * @returns {Promise<FinancialRecord[]>}
 */
export async function getFinancialsAction() {
    await requireAuth();
    try {
        return await getFinancials();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a financial record.
 * @param {Object} values
 * @returns {Promise<FinancialRecord>}
 */
export async function createFinancialRecordAction(values) {
    await requireAuth();
    try {
        const validatedFields = CreateFinancialRecordSchema.safeParse(values);

        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }

        return await createFinancialRecord(validatedFields.data);
    } catch (error) {
        throw error;
    }
}

/**
 * Update a financial record.
 * @param {string} id
 * @param {Object} values
 * @returns {Promise<FinancialRecord>}
 */
export async function updateFinancialRecordAction(id, values) {
    await requireAuth();
    try {
        if (!id) {
            throw new Error('Record ID is required');
        }

        const validatedFields = UpdateFinancialRecordSchema.safeParse(values);

        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }

        return await updateFinancialRecord(id, validatedFields.data);
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a financial record.
 * @param {string} id
 * @returns {Promise<FinancialRecord>}
 */
export async function deleteFinancialRecordAction(id) {
    await requireAuth();
    try {
        if (!id) {
            throw new Error('Record ID is required');
        }

        return await deleteFinancialRecord(id);
    } catch (error) {
        throw error;
    }
}
