/**
 * API Configuration
 * Contains all the configuration needed for making API calls to external systems
 */

import { ENV } from './env.js';

export const FLEX_API_CONFIG = {
    // Base URLs for different environments
    baseUrl: ENV.FLEX_API_BASE_URL,

    // Common headers that should be included in all requests
    defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },

    // Authentication configuration
    auth: {
        username: ENV.FLEX_API_USERNAME,
        password: ENV.FLEX_API_PASSWORD,
    },

    // Instance configuration
    instance: ENV.FLEX_API_INSTANCE,
    companynumber: ENV.FLEX_API_COMPANY_NUMBER,

    // Default timeout in milliseconds
    timeout: 60000,

    // Endpoints
    endpoints: {
        absenceApplications: '/api/absenceapplications',
    },

    // Rate limiting configuration
    rateLimit: {
        maxRequests: 100,
        timeWindow: 60000, // 1 minute in milliseconds
    },
};
