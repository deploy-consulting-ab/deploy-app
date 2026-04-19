'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { FinancialsListPhoneComponent } from '@/components/application/management/financials/phone/financials-list-phone';
import { FinancialsListDesktopComponent } from '@/components/application/management/financials/financials-list-desktop';

export function FinancialsListComponent({ records, error, canManage }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <FinancialsListPhoneComponent
                records={records}
                error={error}
                canManage={canManage}
            />
        );
    }

    return (
        <FinancialsListDesktopComponent
            records={records}
            error={error}
            canManage={canManage}
        />
    );
}
