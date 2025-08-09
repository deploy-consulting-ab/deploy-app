"use server";

import { CalloutService } from "../callouts/callout-service.js";
import { FLEX_API_CONFIG } from "./flex-config.js";
import { ENV } from "./env.js";

class FlexApiService extends CalloutService {
  constructor() {
    super(FLEX_API_CONFIG);
  }

  // Helper method to add common Flex parameters
  addFlexParams(params = {}) {
    return {
      ...params,
      instance: ENV.FLEX_API_INSTANCE,
      companynumber: ENV.FLEX_API_COMPANY_NUMBER,
    };
  }

  // Override get method to automatically add Flex-specific parameters
  async get(endpoint, options = {}) {
    const flexOptions = {
      ...options,
      params: this.addFlexParams(options.params),
      headers: {
        ...options.headers,
        "Service-Version": "1.0",
      },
    };
    return super.get(endpoint, flexOptions);
  }

  // Specialized methods for Flex API endpoints
  async getAbsenceApplications(employeeNumber) {
    return this.get(FLEX_API_CONFIG.endpoints.absenceApplications, {
      params: {
        employmentnumber: employeeNumber,
      },
    });
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
