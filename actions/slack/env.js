export const ENV = {
    // Incoming Webhook – used for posting to the shared timereport channel
    SLACK_API_BASE_URL: process.env.SLACK_API_BASE_URL,
    SLACK_TIMEREPORT_API: process.env.SLACK_TIMEREPORT_API,

    // Bot Token – used for the Slack Web API (direct messages, user lookups)
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
};

const requiredEnvVars = ['SLACK_API_BASE_URL', 'SLACK_TIMEREPORT_API', 'SLACK_BOT_TOKEN'];

requiredEnvVars.forEach((varName) => {
    if (!ENV[varName]) {
        console.warn(`Warning: Required environment variable ${varName} is not set`);
    }
});
