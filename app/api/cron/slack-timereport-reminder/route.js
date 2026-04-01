import { db } from '@/lib/db';
import { sendSlackTimereportReminder } from '@/actions/slack/slack-actions';
import {
    getWeekMonday,
    getWeekSunday,
    formatDateToISOString,
    getSwedishDateTime,
} from '@/lib/utils';
import { getEmployeesWithActiveAssignments } from '@/actions/salesforce/salesforce-actions';

/**
 * GET /api/cron/slack-timereport-reminder
 *
 * Sends Slack reminders to active non-subcontractor users who have not yet
 * submitted a TimereportCheckmark for the relevant week.
 *
 * Trigger schedule (configured in vercel.json) — testing:
 *   Wednesday 22:30 Europe/Stockholm. Two UTC crons (20:30 and 21:30) cover CET/CEST;
 *   getSwedishDateTime ensures only the run that lands at Swedish hour 22 continues.
 *
 * Target week logic (testing):
 *   Wednesday → current week (weekStartDate = Monday of the current week)
 *
 * weekStartDate is stored in the DB as the Monday of the week at 00:00:00 UTC,
 * matching what TimereportCheckmark records use when created by users.
 *
 * Slack message delivery:
 *   Each non-reporting user receives a direct message (not a channel post):
 *   "Reminder: You have not reported your hours for the week YYYY-MM-DD - YYYY-MM-DD."
 *   Sent via sendSlackTimereportReminder → Slack Web API Bot Token (SLACK_BOT_TOKEN).
 *   Required Bot Token scopes: users:read.email, im:write, chat:write.
 *
 * Required env vars:
 *   CRON_SECRET      – set in Vercel project settings; Vercel injects it as the
 *                      Authorization: Bearer <secret> header on every cron request.
 *   SLACK_BOT_TOKEN  – xoxb-... Bot Token for the Slack Web API.
 *
 * Responses:
 *   401  Unauthorized        – missing or invalid CRON_SECRET
 *   200  Outside time window – cron fired but Swedish weekday/hour is not Wed 22
 *   200  No eligible users   – no active non-subcontractor users in the DB
 *   200  All reported        – every eligible user already has a checkmark
 *   200  Reminders processed – list of sent / failed results per user
 *   500  Internal error      – unexpected exception
 */
export async function GET(request) {
    try {
        // Reject requests that do not carry the expected Vercel cron secret.
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Determine the current Stockholm wall-clock time.
        // Two UTC crons cover CET/CEST; only the run at Swedish Wed 22:xx continues.
        const now = new Date();
        const { weekday, hour } = getSwedishDateTime(now);

        const isWednesday = weekday === 'Wed';
        const isRightHour = isWednesday && hour === 22;

        if (!isRightHour) {
            return Response.json(
                { message: 'Outside reminder time window', weekday, hour },
                { status: 200 }
            );
        }

        // Build the target weekStartDate as Monday at 00:00:00 UTC.
        // This matches how TimereportCheckmark records are stored (via getWeekMonday).
        const utcToday = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );

        const weekStartDate = getWeekMonday(utcToday);

        // Fetch all active users excluding subcontractors, who are not required
        // to submit timereports through this system.
        // email is included because sendSlackTimereportReminder resolves the
        // Slack user ID from the user's email via users.lookupByEmail.
        const users = await db.user.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                employeeNumber: true,
            },
        });

        if (users.length === 0) {
            return Response.json({ message: 'No eligible users found' }, { status: 200 });
        }

        // One batch query for all checkmarks submitted for the target week.
        // Building a Set avoids an O(n²) lookup when filtering users below.
        const checkmarks = await db.timereportCheckmark.findMany({
            where: { weekStartDate },
            select: { userId: true },
        });

        const checkedUserIds = new Set(checkmarks.map((c) => c.userId));
        const usersWithoutCheckmark = users.filter((u) => !checkedUserIds.has(u.id));

        const todayFormatDateKey = formatDateToISOString(now);
        const employeesWithActiveAssignments = await getEmployeesWithActiveAssignments(
            usersWithoutCheckmark.map((user) => user.employeeNumber),
            todayFormatDateKey
        );

        const usersWithoutCheckmarkAndActiveAssignments = usersWithoutCheckmark.filter((user) =>
            employeesWithActiveAssignments.has(user.employeeNumber)
        );

        const weekStartStr = formatDateToISOString(weekStartDate);
        const weekEndStr = formatDateToISOString(getWeekSunday(weekStartDate));

        if (usersWithoutCheckmarkAndActiveAssignments.length === 0) {
            return Response.json(
                { message: 'All users have reported hours', weekStartDate: weekStartStr },
                { status: 200 }
            );
        }

        // Send one direct message per user who has not yet reported.
        // Each message goes to the user's own DM via the Slack Web API.
        // Failures are caught individually so one failed lookup or send does
        // not prevent reminders from reaching the remaining users.
        const results = [];

        for (const user of usersWithoutCheckmarkAndActiveAssignments) {
            if (user.email !== 'agnieto@deployconsulting.se') {
                continue;
            }
            try {
                await sendSlackTimereportReminder(user.email, weekStartStr, weekEndStr);
                results.push({ userId: user.id, name: user.name, status: 'sent' });
            } catch (error) {
                console.error(`Failed to send Slack DM reminder to ${user.name}:`, error);
                results.push({
                    userId: user.id,
                    name: user.name,
                    status: 'failed',
                    error: error.message,
                });
            }
        }

        return Response.json(
            {
                message: 'Reminders processed',
                weekStartDate: weekStartStr,
                totalEligibleUsers: users.length,
                remindersSent: usersWithoutCheckmarkAndActiveAssignments.length,
                results,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Slack timereport reminder cron error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
