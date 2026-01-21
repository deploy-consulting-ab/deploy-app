/**
 * API Configuration
 * Contains all the configuration needed for making API calls to external systems
 */

import { ENV } from './env.js';

export const SLACK_API_CONFIG = {
    // Base URLs for different environments
    baseUrl: ENV.SLACK_API_BASE_URL,

    // Common headers that should be included in all requests
    defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },

    // Default timeout in milliseconds
    timeout: 60000,

    // Endpoints
    endpoints: {
        timereport: ENV.SLACK_TIMEREPORT_API,
    },
};
