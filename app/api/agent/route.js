import { streamText, convertToModelMessages } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { auth } from '@/auth';
import { createAgentTools } from '@/actions/agent/agent-tools';
import { toPermissionSet } from '@/lib/utils';
import { VIEW_MANAGEMENT_PERMISSION } from '@/lib/rba-constants';

function buildSystemPrompt (user) {
    const today = new Date().toISOString().split('T')[0];
    const userName = user?.name ?? 'the user';
    const hasEmployeeNumber = !!user?.employeeNumber;
    const hasFlexId = !!user?.flexEmployeeId;
    const hasManagementViewPermission = toPermissionSet(user?.systemPermissions).has(VIEW_MANAGEMENT_PERMISSION);

    return `You are a helpful AI assistant for the Tilde app, used internally by a consulting company called Deploy.

Today's date is ${today}.

The logged-in user is ${userName}.${hasEmployeeNumber ? ` Their employee number is ${user.employeeNumber}.` : ''}${hasFlexId ? ` Their Flex employee ID is ${user.flexEmployeeId}.` : ''}

## Available data sources

You have tools to query three systems:

**Salesforce** (source of truth for HR and project data):
- Employees and their details
- Project assignments (ongoing, completed, not started)
- Sales opportunities with stages, amounts, and close dates
- Monthly occupancy rates and statistics

**Flex** (HR / time-tracking system):
- Weekly time reports with logged hours per project
- Holiday and absence requests

**Internal database** (financial records):
- Quarterly and annual revenue, cost, profit, and taxes by fiscal year (Feb 1 – Jan 31)

## Guidelines

- When the user asks about themselves without specifying, default to their employee number / Flex ID.
- Always use the correct date format (YYYY-MM-DD) when calling tools.
- If a tool returns no data, say so clearly rather than guessing.
- Present numbers in a readable format: currencies with symbols, percentages with %, dates in a human-friendly format.
- For multi-step questions, use multiple tool calls to gather all needed information before answering.
- Be concise and factual. Do not fabricate data.
- IMPORTANT: After every tool call, you MUST always write a text response summarising the results for the user. Never end your turn silently after a tool call.
- SECURITY: ${hasManagementViewPermission
        ? 'You have management access and may retrieve employee data for any employee, including employee details, assignments, occupancy, and time reports. Holidays remain self-only.'
        : `You are NEVER allowed to retrieve personal data (employee details, assignments, occupancy, time reports, holidays) for any employee other than the logged-in user (${user?.employeeNumber ?? 'unknown'}). If asked about another employee's personal data, refuse immediately and explain that you can only show the user their own information.`
    }`;
}

export async function POST (req) {
    const session = await auth();

    if (!session?.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    const openrouter = createOpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
        model: openrouter('openrouter/free'),
        system: buildSystemPrompt(session.user),
        messages: await convertToModelMessages(messages),
        tools: createAgentTools(session.user),
    });

    return result.toUIMessageStreamResponse();
}
