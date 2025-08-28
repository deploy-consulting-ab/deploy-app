import { LoginFormComponent } from '@/components/auth/login-form';
import { LoginFormGoogleComponent } from '@/components/auth/login-form-google';

const LoginPage = () => {
    const loginMethod = process.env.LOGIN_METHOD;

    return <>{loginMethod === 'google' ? <LoginFormGoogleComponent /> : <LoginFormComponent />}</>;
};

export default LoginPage;
