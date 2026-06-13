import { auth } from '@/auth';
import { ImpersonationBannerComponent } from '@/components/application/impersonation/impersonation-banner';
import { AppHeaderBar } from '@/components/application/app-header-bar';
import { VIEW_SETUP_PERMISSION } from '@/lib/rba-constants';

export async function AppHeaderComponent({ location }) {
    const session = await auth();
    const { user } = session;

    const isHomePage = location === 'home';
    const showSetup = user.systemPermissions.includes(VIEW_SETUP_PERMISSION) && isHomePage;

    return (
        <>
            <ImpersonationBannerComponent />
            <AppHeaderBar user={user} location={location} showSetup={showSetup} />
        </>
    );
}
