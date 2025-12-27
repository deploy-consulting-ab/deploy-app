'use server';

import { unstable_cache, revalidateTag } from 'next/cache';
import { getSalesforceConnection, invalidateSalesforceConnection } from './salesforce-auth';
import { NetworkError } from '../callouts/errors';
import chalk from 'chalk';

// Default cache duration: 1 hour (in seconds)
const DEFAULT_CACHE_DURATION = 3600;

/**
 * Generic error handler for Salesforce operations
 * @param {Error} error - The error to handle
 * @param {string} operation - The name of the operation that failed
 */
const handleSalesforceError = async (error, operation) => {
    if (error instanceof NetworkError) {
        console.error(
            `Salesforce Network error when connecting to Salesforce to ${operation}`,
            error.message
        );
        throw error;
    }

    if (error.errorCode === 'INVALID_SESSION_ID') {
        console.log(chalk.yellow('Invalid session ID, refreshing token'));
        invalidateSalesforceConnection();
        const newConnection = await getSalesforceConnection();
        return newConnection;
    }

    console.error(`Salesforce ${operation} error:`, error);
    throw new Error(`Failed to ${operation}: ${error.message}`);
};

/**
 * Execute a SOQL query
 * @param {string} query - The SOQL query to execute
 * @returns {Promise<Array>} The query results
 */
export async function queryData(query) {
    try {
        const connection = await getSalesforceConnection();
        const result = await connection.query(query);
        return result.records;
    } catch (error) {
        const connection = await handleSalesforceError(error, 'query data');

        if (connection) {
            const result = await connection.query(query);
            return result.records;
        }
    }
}

/**
 * Execute a cached SOQL query - use for data that doesn't change often
 * @param {string} query - The SOQL query to execute
 * @param {Object} options - Cache options
 * @param {string[]} options.tags - Additional cache tags for targeted revalidation
 * @param {number} options.revalidate - Cache duration in seconds (default: 1 hour)
 * @param {string} options.cacheKey - Optional unique key for the cache entry
 * @returns {Promise<Array>} The query results
 */
export async function queryCachedData(query, options = {}) {
    const { tags = [], revalidate = DEFAULT_CACHE_DURATION, cacheKey = query } = options;

    const cachedQuery = unstable_cache(
        async () => {
            try {
                const connection = await getSalesforceConnection();
                const result = await connection.query(query);
                return result.records;
            } catch (error) {
                const connection = await handleSalesforceError(error, 'cached query data');

                if (connection) {
                    const result = await connection.query(query);
                    return result.records;
                }
            }
        },
        [cacheKey],
        {
            tags: ['salesforce', ...tags],
            revalidate,
        }
    );

    return cachedQuery();
}

/**
 * Invalidate cached Salesforce data by tag
 * @param {string} tag - The cache tag to invalidate
 */
export async function invalidateSalesforceCache(tag = 'salesforce') {
    revalidateTag(tag);
}

/**
 * Execute a SOSL search
 * @param {string} searchTerm - The SOSL search string
 * @returns {Promise<Array>} The search results
 */
export async function searchSOSL(searchTerm) {
    try {
        const connection = await getSalesforceConnection();
        const result = await connection.search(searchTerm);
        return result.searchRecords;
    } catch (error) {
        const connection = await handleSalesforceError(error, 'SOSL search');

        if (connection) {
            const result = await connection.search(searchTerm);
            return result.searchRecords;
        }
    }
}

/**
 * Create a new record
 * @param {string} objectName - The API name of the Salesforce object
 * @param {Object} data - The record data
 * @returns {Promise<Object>} The created record
 */
export async function createRecord(objectName, data) {
    try {
        const connection = await getSalesforceConnection();
        const result = await connection.sobject(objectName).create(data);
        return result;
    } catch (error) {
        const connection = await handleSalesforceError(error, `create ${objectName} record`);

        if (connection) {
            const result = await connection.sobject(objectName).create(data);
            return result;
        }
    }
}

/**
 * Update an existing record
 * @param {string} objectName - The API name of the Salesforce object
 * @param {string} recordId - The ID of the record to update
 * @param {Object} data - The updated record data
 * @returns {Promise<Object>} The update result
 */
export async function updateRecord(objectName, recordId, data) {
    try {
        const connection = await getSalesforceConnection();
        const result = await connection.sobject(objectName).update({ Id: recordId, ...data });
        return result;
    } catch (error) {
        const connection = await handleSalesforceError(error, `update ${objectName} record`);

        if (connection) {
            const result = await connection.sobject(objectName).update({ Id: recordId, ...data });
            return result;
        }
    }
}

/**
 * Delete a record
 * @param {string} objectName - The API name of the Salesforce object
 * @param {string} recordId - The ID of the record to delete
 * @returns {Promise<Object>} The deletion result
 */
export async function deleteRecord(objectName, recordId) {
    try {
        const connection = await getSalesforceConnection();
        const result = await connection.sobject(objectName).destroy(recordId);
        return result;
    } catch (error) {
        const connection = await handleSalesforceError(error, `delete ${objectName} record`);

        if (connection) {
            const result = await connection.sobject(objectName).destroy(recordId);
            return result;
        }
    }
}

/**
 * Execute a batch query for large datasets
 * @param {string} query - The SOQL query to execute
 * @param {Function} batchHandler - Function to handle each batch of records
 */
export async function queryBatch(query, batchHandler) {
    try {
        const connection = await getSalesforceConnection();
        return new Promise((resolve, reject) => {
            connection
                .query(query)
                .on('record', batchHandler)
                .on('end', resolve)
                .on('error', reject)
                .run({ autoFetch: true, maxFetch: 50000 });
        });
    } catch (error) {
        const connection = await handleSalesforceError(error, 'batch query');

        if (connection) {
            return new Promise((resolve, reject) => {
                connection
                    .query(query)
                    .on('record', batchHandler)
                    .on('end', resolve)
                    .on('error', reject)
                    .run({ autoFetch: true, maxFetch: 50000 });
            });
        }
    }
}
