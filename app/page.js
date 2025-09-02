import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/menus/routes';

export default function Home() {
    redirect(LOGIN_ROUTE);
}
