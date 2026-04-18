'use server';

import { auth } from '@/auth';
import { getFinancialsAction } from '@/actions/database/financials-actions';
import { FinancialsListComponent } from '@/components/application/management/financials/financials-list';
import { VIEW_SETUP_PERMISSION } from '@/lib/rba-constants';

export default async function FinancialsPage() {
    const session = await auth();
    const canManage = session?.user?.systemPermissions?.includes(VIEW_SETUP_PERMISSION) ?? false;

    let records = null;
    let error = null;

    try {
        records = await getFinancialsAction();
    } catch (err) {
        error = err;
    }

    return (
        <FinancialsListComponent
            records={records ?? []}
            error={error}
            canManage={canManage}
        />
    );
}
