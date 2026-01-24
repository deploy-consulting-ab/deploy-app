'use server';

import { CalloutService } from '../callouts/callout-service.js';
import { FLEX_API_CONFIG } from './flex-config.js';
import { ENV } from './env.js';

class FlexApiService extends CalloutService {
    constructor() {
        super(FLEX_API_CONFIG);
    }

    // Helper method to add common Flex parameters
    addFlexParams(params = {}) {
        return {
            ...params,
        };
    }

    // Override get method to automatically add Flex-specific parameters
    async get(endpoint, options = {}) {
        const flexOptions = {
            ...options,
            params: this.addFlexParams(options.params),
            headers: {
                ...options.headers,
                'Service-Version': '1.0',
            },
        };
        return super.get(endpoint, flexOptions);
    }

    async put(endpoint, body, options = {}) {
        const flexOptions = {
            ...options,
            params: this.addFlexParams(options.params),
            headers: {
                ...options.headers,
                'Service-Version': '1.0',
            },
        };
        return super.put(endpoint, body, flexOptions);
    }

    async post(endpoint, body, options = {}) {
        const flexOptions = {
            ...options,
            params: this.addFlexParams(options.params),
            headers: {
                ...options.headers,
                'Service-Version': '1.0',
            },
        };
        return super.post(endpoint, body, flexOptions);
    }

    async delete(endpoint) {
        return super.delete(endpoint);
    }

    // Specialized methods for Flex API endpoints
    async getAbsenceApplications(employeeNumber, absenceTypeId) {
        const response = await this.get(FLEX_API_CONFIG.endpoints.absenceApplications, {
            params: {
                employmentnumber: employeeNumber,
                instance: ENV.FLEX_API_INSTANCE,
                companynumber: ENV.FLEX_API_COMPANY_NUMBER,
                ...(absenceTypeId && { absenceTypeId: absenceTypeId }),
                pageSize: 100,
            },
        });

        return await response.json();
    }

    async createAbsenceApplication(employeeNumber, absenceApplicationPayload) {
        const response = await this.post(
            FLEX_API_CONFIG.endpoints.absenceApplications,
            absenceApplicationPayload,
            {
                params: {
                    employmentnumber: employeeNumber,
                },
            }
        );

        return await response.json();
    }

    async getTimereports(employeeId, weekStartDate, weekEndDate) {
        const response = await this.get(`${FLEX_API_CONFIG.endpoints.timereports}/${employeeId}`, {
            params: {
                from: weekStartDate,
                tom: weekEndDate,
            },
        });

        return await response.json();
    }

    async deleteAbsenceApplication(absenceRequestId) {
        const response = await this.delete(
            `${FLEX_API_CONFIG.endpoints.absenceApplications}/${absenceRequestId}`
        );

        return response.status;
    }

    async updateAbsenceApplication(absenceRequestId, absenceApplicationPayload) {
        const response = await this.put(
            `${FLEX_API_CONFIG.endpoints.absenceApplications}/${absenceRequestId}`,
            absenceApplicationPayload
        );

        return await response.json();
    }

    async createTimereport(employeeId, date, body) {
        const response = await this.put(
            `${FLEX_API_CONFIG.endpoints.employees}/${employeeId}/timereports/${date}`,
            body
        );

        return response.status;
    }
}

// Create and export a singleton instance
let instance = null;

export async function getFlexApiService() {
    if (!instance) {
        instance = new FlexApiService();
    }
    return instance;
}

// Export the class for testing or custom instances if needed
export { FlexApiService };
