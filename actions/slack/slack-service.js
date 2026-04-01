'use server';

import { CalloutService } from '../callouts/callout-service.js';
import { SLACK_API_CONFIG, SLACK_WEB_API_CONFIG } from './slack-config.js';

// ---------------------------------------------------------------------------
// Incoming Webhook service
// Posts to the fixed channel configured when the webhook was created.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Slack Web API service
// Authenticated with a Bot Token (SLACK_BOT_TOKEN).
// Supports user lookups and direct messages.
//
// Required Bot Token scopes:
//   users:read.email  – resolve a Slack user ID from an email address
//   im:write          – open a DM channel with a user
//   chat:write        – post a message to a channel or DM
// ---------------------------------------------------------------------------

class SlackWebApiService extends CalloutService {
    constructor() {
        super(SLACK_WEB_API_CONFIG);
    }

    /**
     * Resolve a Slack user ID from an email address.
     * Calls users.lookupByEmail.
     *
     * @param {string} email
     * @returns {Promise<string>} Slack user ID (e.g. "U012AB3CD")
     * @throws {Error} If the email is not found in the workspace or the API call fails
     */
    async lookupUserByEmail(email) {
        const response = await this.get(SLACK_WEB_API_CONFIG.endpoints.lookupByEmail, {
            params: { email },
        });
        const data = await response.json();
        if (!data.ok) {
            throw new Error(`Slack users.lookupByEmail failed: ${data.error}`);
        }
        return data.user.id;
    }

    /**
     * Open (or reuse) a direct message channel with a user.
     * Calls conversations.open. Idempotent – returns the existing DM if one is open.
     *
     * @param {string} slackUserId  Slack user ID returned by lookupUserByEmail
     * @returns {Promise<string>} DM channel ID (e.g. "D01234567")
     * @throws {Error} If the API call fails
     */
    async openDirectMessage(slackUserId) {
        const response = await this.post(SLACK_WEB_API_CONFIG.endpoints.openConversation, {
            users: slackUserId,
        });
        const data = await response.json();
        if (!data.ok) {
            throw new Error(`Slack conversations.open failed: ${data.error}`);
        }
        return data.channel.id;
    }

    /**
     * Post a plain-text message to a channel or DM.
     * Calls chat.postMessage.
     *
     * @param {string} channelId  Channel or DM ID
     * @param {string} text       Message text
     * @throws {Error} If the API call fails
     */
    async postMessage(channelId, text) {
        const response = await this.post(SLACK_WEB_API_CONFIG.endpoints.postMessage, {
            channel: channelId,
            text,
        });
        const data = await response.json();
        if (!data.ok) {
            throw new Error(`Slack chat.postMessage failed: ${data.error}`);
        }
        return data;
    }
}

let webApiInstance = null;

export async function getSlackWebApiService() {
    if (!webApiInstance) {
        webApiInstance = new SlackWebApiService();
    }
    return webApiInstance;
}
