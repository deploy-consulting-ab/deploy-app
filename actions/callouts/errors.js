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
 * Handles API response errors and throws appropriate custom errors
 */
export const handleApiError = async (response) => {
    const message = response.statusText || `HTTP Error ${response.status}`;
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
