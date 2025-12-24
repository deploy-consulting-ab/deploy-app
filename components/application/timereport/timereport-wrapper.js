'use server';

import { sampleProjects, generateSampleTimeEntries } from '@/lib/mock-data';
import { TimereportCard } from './timereport-card';

/**
 * Server component wrapper for the time reporting feature.
 * Fetches projects and existing time entries from the server.
 */
export async function TimereportWrapper({ user }) {
    // In a real implementation, these would be fetched from the database
    const projects = await getProjects(user);
    const existingEntries = await getTimeEntries(user);

    return (
        <TimereportCard
            projects={projects}
            existingEntries={existingEntries}
            userName={user?.name}
        />
    );
}

/**
 * Mock function to fetch projects - replace with actual API call
 */
async function getProjects() {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return sampleProjects;

    // Get projects from Salesforce!
}

/**
 * Mock function to fetch existing time entries - replace with actual API call
 */
async function getTimeEntries() {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return generateSampleTimeEntries();
}
