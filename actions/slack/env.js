export const ENV = {
    SLACK_API_BASE_URL: process.env.SLACK_API_BASE_URL,
    SLACK_TIMEREPORT_API: process.env.SLACK_TIMEREPORT_API,
};

// Validate required environment variables
const requiredEnvVars = ['SLACK_API_BASE_URL', 'SLACK_TIMEREPORT_API'];

requiredEnvVars.forEach((varName) => {
    if (!ENV[varName]) {
        console.warn(`Warning: Required environment variable ${varName} is not set`);
    }
});
