import { auth } from '@/auth';
import { logout } from '@/actions/logout';
import { HomeComponent } from '@/components/application/home-page';

const HomePage = async () => {

    const session = await auth();

    return <div>
        {/* {JSON.stringify(session)}
        <form action={logout}>
            <button type="submit">
                Sign out
            </button>
        </form> */}
        <HomeComponent />
    </div>;
};

export default HomePage;
