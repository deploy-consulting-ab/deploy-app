/**
 * Custom error classes and error handling utilities
 */

export class ApiError extends Error {
    constructor(message, status, code, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.data = data;
    }
}

export class NetworkError extends Error {
    constructor(message, status, code, originalError = null) {
        super(message);
        this.name = 'NetworkError';
        this.originalError = originalError;
        this.status = status;
        this.code = code;
    }
}

export class NoResultsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'No results found';
    }
}

export class ValidationError extends Error {
    constructor(message, validationErrors = {}) {
        super(message);
        this.name = 'ValidationError';
        this.validationErrors = validationErrors;
    }
}

/**
 * Handles API response errors and throws appropriate custom errors.
 * Parses the response body when available to surface the API's validation message.
 */
export const handleApiError = async (response) => {
    let message = response.statusText || `HTTP Error ${response.status}`;
    const contentType = response.headers.get('content-type');
    try {
        if (contentType?.includes('application/json')) {
            const data = await response.clone().json();
            if (data?.message) message = data.message;
            else if (data?.error) message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            else if (data?.Message) message = data.Message;
            else if (typeof data === 'string') message = data;
            else if (Object.keys(data || {}).length > 0) message = JSON.stringify(data);
        } else {
            const text = await response.clone().text();
            if (text?.trim()) message = text.trim();
        }
    } catch (_) {
        // Keep default message if parsing fails
    }
    throw new ApiError(message, response.status, response.code || 'UNKNOWN_ERROR', response);
};

/**
 * Validates response data against expected schema/type
 * This is a simple implementation - you might want to use a validation library
 */
export const validateResponse = (data, expectedShape) => {
    // Add your validation logic here
    // This is just a basic example
    if (!data || typeof data !== expectedShape) {
        throw new ValidationError('Invalid response data', {
            expected: expectedShape,
            received: typeof data,
        });
    }
    return data;
};
