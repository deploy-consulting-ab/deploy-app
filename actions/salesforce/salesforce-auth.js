// lib/jsforce.js

import jsforce from 'jsforce';
import { NetworkError } from '../callouts/errors';

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
        console.log('Existing connection & valid token!');
        return connection;
    }

    try {
        console.log('Token expired, getting new token...');

        // Use fetch as jsforce did not with the client credentials flow
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        myHeaders.append(
            'Cookie',
            'BrowserId=iswviZGUEfCLqenlO9eaxQ; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1'
        );

        const urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'client_credentials');
        urlencoded.append(
            'client_id',
            process.env.SALESFORCE_CLIENT_ID            
        );
        urlencoded.append(
            'client_secret',
            process.env.SALESFORCE_CLIENT_SECRET
        );

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow',
        };

        const fetchResponse = await fetch(
            process.env.SALESFORCE_LOGIN_URL + '/services/oauth2/token',
            requestOptions
        );

        const result = await fetchResponse.json();
        const newConnection = new jsforce.Connection({
            instanceUrl: result.instance_url,
            accessToken: result.access_token,
        });

        connection = newConnection;

        return connection;
        
    } catch (error) {
        // Clear the failed connection attempt
        connection = null;
        throw new NetworkError(
            'Could not connect to Salesforce. ' + error.message,
            error.status,
            error.code,
            error
        );
    }
}

export async function invalidateSalesforceConnection() {
    connection = null;
}
