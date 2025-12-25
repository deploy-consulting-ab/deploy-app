import { auth } from '@/auth';
import { TimereportCard } from '@/components/application/timereport/timereport-card';

export default async function TimereportPage() {
    const session = await auth();
    const { user } = session;
    const employeeNumber = user.employeeNumber;

    return (
        <div className="py-4">
            <TimereportCard employeeNumber={employeeNumber} />
        </div>
    );
}
