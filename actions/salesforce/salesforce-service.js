'use server';

import { getSalesforceConnection } from './salesforce-auth';

/**
 * Generic error handler for Salesforce operations
 * @param {Error} error - The error to handle
 * @param {string} operation - The name of the operation that failed
 */
const handleSalesforceError = (error, operation) => {
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
        const conn = await getSalesforceConnection();
        const result = await conn.query(query);
        return result.records;
    } catch (error) {
        handleSalesforceError(error, 'query data');
    }
}

/**
 * Execute a SOSL search
 * @param {string} searchTerm - The SOSL search string
 * @returns {Promise<Array>} The search results
 */
export async function searchSOSL(searchTerm) {
    try {
        const conn = await getSalesforceConnection();
        const result = await conn.search(searchTerm);
        return result.searchRecords;
    } catch (error) {
        handleSalesforceError(error, 'SOSL search');
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
        const conn = await getSalesforceConnection();
        const result = await conn.sobject(objectName).create(data);
        return result;
    } catch (error) {
        handleSalesforceError(error, `create ${objectName} record`);
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
        const conn = await getSalesforceConnection();
        const result = await conn.sobject(objectName).update({ Id: recordId, ...data });
        return result;
    } catch (error) {
        handleSalesforceError(error, `update ${objectName} record`);
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
        const conn = await getSalesforceConnection();
        const result = await conn.sobject(objectName).destroy(recordId);
        return result;
    } catch (error) {
        handleSalesforceError(error, `delete ${objectName} record`);
    }
}

/**
 * Execute a batch query for large datasets
 * @param {string} query - The SOQL query to execute
 * @param {Function} batchHandler - Function to handle each batch of records
 */
export async function queryBatch(query, batchHandler) {
    try {
        const conn = await getSalesforceConnection();
        return new Promise((resolve, reject) => {
            conn.query(query)
                .on('record', batchHandler)
                .on('end', resolve)
                .on('error', reject)
                .run({ autoFetch: true, maxFetch: 50000 });
        });
    } catch (error) {
        handleSalesforceError(error, 'batch query');
    }
}
