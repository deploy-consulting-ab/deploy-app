import { LoginFormComponent } from '@/components/auth/login-form';
import { LoginFormGoogleComponent } from '@/components/auth/login-form-google';

const LoginPage = () => {
    console.log(process.env.LOGIN_METHOD);

    const loginMethod = process.env.LOGIN_METHOD;

    return <>{loginMethod === 'google' ? <LoginFormGoogleComponent /> : <LoginFormComponent />}</>;
};

export default LoginPage;
