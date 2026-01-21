'use server';

import { CalloutService } from '../callouts/callout-service.js';
import { SLACK_API_CONFIG } from './slack-config.js';

class SlackService extends CalloutService {
    constructor() {
        super(SLACK_API_CONFIG);
    }

    async postSlackTimereport(body) {
        const response = await this.post(SLACK_API_CONFIG.endpoints.timereport, body);
        return response;
    }
}

let instance = null;

export async function getSlackService() {
    if (!instance) {
        instance = new SlackService();
    }
    return instance;
}
