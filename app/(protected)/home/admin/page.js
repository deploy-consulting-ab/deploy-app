'use server';

import { CreateUserComponent } from '@/components/application/setup/users/create-user';

const AdminPage = async () => {
    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="w-full max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Register New User</h2>
                        <CreateUserComponent />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
