import { RegisterFormComponent } from '@/components/auth/register-form';

const AdminPage = async () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <RegisterFormComponent />
        </div>
    );
};

export default AdminPage;
