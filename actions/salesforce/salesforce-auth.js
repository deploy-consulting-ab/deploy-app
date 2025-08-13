// lib/jsforce.js

import jsforce from 'jsforce';

// This variable will hold the cached connection.
let connection = null;

/**
 * Establishes a connection to Salesforce if one doesn't already exist.
 * Returns the active jsforce connection object.
 * This singleton pattern prevents logging in for every request.
 */
export async function getSalesforceConnection() {
    // If we already have a connection and its access token is valid, return it.
    if (connection && connection.accessToken) {
        console.log('Using cached jsforce connection.');
        return connection;
    }

    console.log('No valid jsforce connection found. Creating new one.');

    // Create a new connection instance.
    // The 'oauth2' property will be used for the Username-Password flow.
    // const newConnection = new jsforce.Connection({
    //     oauth2: {
    //         loginUrl: process.env.SALESFORCE_LOGIN_URL,
    //         clientId: process.env.SALESFORCE_CLIENT_ID,
    //         clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    //     },
    // });

    const newConnection = new jsforce.Connection({
        loginUrl: process.env.SALESFORCE_LOGIN_URL,
    });

    try {
        // Log in to Salesforce using the Username-Password flow.
        await newConnection.login(
            process.env.SALESFORCE_USERNAME,
            `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
        );

        console.log('Successfully logged in to Salesforce.');
        console.log('Instance URL:', newConnection.instanceUrl);
        console.log('Access Token:', newConnection.accessToken.substring(0, 10) + '...'); // Don't log the full token in production

        // Cache the successful connection
        connection = newConnection;

        return connection;
    } catch (error) {
        console.error('Salesforce login error:', error.message);
        // Clear the failed connection attempt
        connection = null;
        throw new Error('Could not connect to Salesforce. ' + error.message);
    }
}
