'use server';

import { auth } from '@/auth';
import { getFinancialsAction } from '@/actions/database/financials-actions';
import { FinancialsListComponent } from '@/components/application/management/financials/financials-list';
import { MANAGE_FINANCIALS_PERMISSION } from '@/lib/rba-constants';
import { toPermissionSet } from '@/lib/utils';

export default async function FinancialsPage() {
    const session = await auth();
    const canManage = toPermissionSet(session?.user?.systemPermissions).has(
        MANAGE_FINANCIALS_PERMISSION
    );

    let records = null;
    let error = null;

    try {
        records = await getFinancialsAction();
    } catch (err) {
        error = err;
    }

    return <FinancialsListComponent records={records ?? []} error={error} canManage={canManage} />;
}
