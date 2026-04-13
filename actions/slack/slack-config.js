/**
 * Slack API Configuration
 *
 * Two separate integration patterns are supported:
 *
 *  1. Incoming Webhook (SLACK_API_CONFIG)
 *     Posts to a fixed channel configured at webhook-creation time.
 *     Simple – no auth header required; the secret is embedded in the URL.
 *     Used by: sendSlackTimereport (timereport checkmark notifications)
 *
 *  2. Slack Web API (SLACK_WEB_API_CONFIG)
 *     Full REST API authenticated with a Bot Token (xoxb-...).
 *     Supports user lookups, opening DMs, and posting to any channel.
 *     Used by: sendSlackTimereportReminder (weekly missing-hours DMs)
 */

import { ENV } from './env.js';

/** Incoming Webhook config – destination channel is fixed by the webhook URL. */
export const SLACK_API_CONFIG = {
    baseUrl: ENV.SLACK_API_BASE_URL,
    defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 60000,
    endpoints: {
        timereport: ENV.SLACK_TIMEREPORT_API,
    },
};

/** Slack Web API config – authenticated with a Bot Token, supports DMs. */
export const SLACK_WEB_API_CONFIG = {
    baseUrl: 'https://slack.com/api',
    defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${ENV.SLACK_BOT_TOKEN}`,
    },
    timeout: 60000,
    endpoints: {
        lookupByEmail: 'users.lookupByEmail',
        openConversation: 'conversations.open',
        postMessage: 'chat.postMessage',
    },
};
