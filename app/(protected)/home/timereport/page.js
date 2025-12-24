import { auth } from '@/auth';
import { TimereportWrapper } from '@/components/application/timereport/timereport-wrapper';

export default async function TimereportPage() {
    const session = await auth();
    const { user } = session;

    return (
        <div className="container max-w-6xl mx-auto py-6 px-4">
            <TimereportWrapper user={user} />
        </div>
    );
}
