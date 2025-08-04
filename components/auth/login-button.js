'use client';

import { useRouter } from 'next/navigation';

export const LoginButtonComponent = ({ children, mode = 'redirect', asChild }) => {
    const router = useRouter();
    const onClick = () => {
        router.push('/auth/login');
    };

    if (mode === 'modal') {
        return <p>Implement modal mode</p>;
    }

    return (
        <span className="cursor-pointer" onClick={onClick}>
            {children}
        </span>
    );
};
