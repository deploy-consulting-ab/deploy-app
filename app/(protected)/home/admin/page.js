import { RegisterFormComponent } from '@/components/auth/register-form';
import { ImpersonateUserContainer } from '@/components/application/admin/impersonate-user';

// This is a server component by default (no 'use client' directive)

const AdminPage = async () => {
    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="w-full max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">User Management</h2>
                        <ImpersonateUserContainer />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Register New User</h2>
                        <RegisterFormComponent />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
