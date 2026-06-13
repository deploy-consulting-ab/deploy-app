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
