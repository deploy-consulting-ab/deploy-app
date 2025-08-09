/**
 * Centralized environment configuration
 * IMPORTANT: These environment variables should only be used server-side
 * For client-side code, use the API routes instead
 */

// Export environment variables with defaults
export const ENV = {
  FLEX_API_BASE_URL: process.env.FLEX_URL,
  FLEX_API_USERNAME: process.env.FLEX_USERNAME,
  FLEX_API_PASSWORD: process.env.FLEX_PASSWORD,
  FLEX_API_INSTANCE: process.env.FLEX_INSTANCE,
  FLEX_API_COMPANY_NUMBER: process.env.FLEX_COMPANY_NUMBER,
};

// Validate required environment variables
const requiredEnvVars = ["FLEX_API_USERNAME", "FLEX_API_PASSWORD"];

requiredEnvVars.forEach((varName) => {
  if (!ENV[varName]) {
    console.warn(
      `Warning: Required environment variable ${varName} is not set`
    );
  }
});
