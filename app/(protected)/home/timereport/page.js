import { auth } from '@/auth';
import { TimereportCard } from '@/components/application/timereport/timereport-card';
import { generateSampleTimeEntries } from '@/lib/mock-data';

export default async function TimereportPage() {
    const session = await auth();
    const { user } = session;
    const employeeNumber = user.employeeNumber;

    const existingEntries = await getTimeEntries(user);

    return (
        <TimereportCard
            existingEntries={existingEntries}
            userName={user?.name}
            employeeNumber={employeeNumber}
        />
    );
}

/**
 * Mock function to fetch existing time entries - replace with actual API call
 */
async function getTimeEntries() {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return generateSampleTimeEntries();
}
