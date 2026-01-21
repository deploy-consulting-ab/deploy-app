'use server';

import { getSlackService } from './slack-service.js';

export async function postSlackTimereport(
    employeeName,
    employeeNumber,
    weekStartDate,
    weekEndDate,
    message
) {
    try {
        const body = {
            text: `${employeeName} (${employeeNumber}) ${message} ${weekStartDate} - ${weekEndDate}`,
        };

        const slackService = await getSlackService();
        await slackService.postSlackTimereport(body);
    } catch (error) {
        console.error('Error posting Slack timereport:', error);
        throw error;
    }
}
