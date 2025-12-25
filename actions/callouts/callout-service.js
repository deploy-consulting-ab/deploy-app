/**
 * HTTP Client utility for making API calls
 */
'use server';

import { HTTP_METHODS, STATUS_CODES } from './config.js';
import { handleApiError, NetworkError, ApiError } from './errors.js';

// Helper function for base64 encoding that works in both browser and Node.js
function base64Encode(str) {
    if (typeof window !== 'undefined' && window.btoa) {
        return window.btoa(str);
    }
    return Buffer.from(str).toString('base64');
}

class CalloutService {
    constructor(config) {
        this.config = {
            ...config,
            timeout: config.timeout || 60000, // Default to 60 seconds if not specified
        };
        this.pendingRequests = new Map();
    }

    /**
     * Makes an HTTP request to the API
     */
    async request(endpoint, options = {}) {
        const {
            method = HTTP_METHODS.GET,
            body,
            headers = {},
            params = {},
            timeout = this.config.timeout,
            signal,
        } = options;

        const url = this.buildUrl(endpoint, params);

        // Combine default headers with custom headers
        const requestHeaders = {
            ...this.config.defaultHeaders,
            ...headers,
        };

        // Add Basic Auth header if credentials are configured
        if (this.config.auth?.username && this.config.auth?.password) {
            const credentials = base64Encode(
                `${this.config.auth.username}:${this.config.auth.password}`
            );
            requestHeaders['Authorization'] = `Basic ${credentials}`;
        }

        let controller;
        let timeoutId;

        try {
            // Only create a new AbortController if one wasn't provided
            controller = signal ? null : new AbortController();
            const requestSignal = signal || controller?.signal;

            if (controller) {
                timeoutId = setTimeout(() => {
                    controller.abort();
                }, timeout);
            }

            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: body ? JSON.stringify(body) : undefined,
                signal: requestSignal,
                cache: this.config.cache,
            });

            console.log('## response...', response);

            console.log('## response.ok...', response.ok);
            console.log('## response.status...', response.status);

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (!response.ok) {
                await handleApiError(response);
            }

            const contentLength = response.headers.get('content-length');
            if (contentLength === '0' || contentLength === null) {
                console.log('## data... (empty response)');
                return response;
            }

            const data = await response.json();
            console.log('## data...', data);
            return data;
        } catch (error) {
            console.error('Request error:', {
                message: error.message,
                name: error.name,
                url,
                method,
            });

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (error.name === 'AbortError') {
                throw new NetworkError('Request timeout or aborted');
            }

            if (error.name === 'ApiError') {
                throw new ApiError(error.message, error.status, error.code, error);
            }

            throw new NetworkError(error.message, error.status, error.code, error);
        }
    }

    /**
     * Builds the full URL for an API request
     * @param {string} endpoint - The API endpoint
     * @param {Object} params - Query parameters to add to the URL
     * @returns {string} The complete URL with query parameters
     */
    buildUrl(endpoint, params = {}) {
        const baseUrl = this.config.baseUrl.replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');
        const url = `${baseUrl}/${path}`;

        // If no params, return the URL as is
        if (!params || Object.keys(params).length === 0) {
            return url;
        }

        // Convert params object to URLSearchParams
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            // Handle arrays and objects
            if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key + '[]', item));
            } else if (value !== null && typeof value === 'object') {
                searchParams.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });

        return `${url}?${searchParams.toString()}`;
    }

    /**
     * Convenience methods for different HTTP methods
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: HTTP_METHODS.GET });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: HTTP_METHODS.POST,
            body: data,
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: HTTP_METHODS.PUT,
            body: data,
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: HTTP_METHODS.DELETE });
    }

    async patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: HTTP_METHODS.PATCH,
            body: data,
        });
    }
}

// Export the class for custom instances
export { CalloutService };
