import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import DeployLogo from '@/components/deploy-logo';

const font = Poppins({
    subsets: ['latin'],
    weight: ['600'],
});

export const HeaderComponent = ({ label }) => {
    return (
        <div className="w-full flex flex-col pt-2 items-center justify-center">
            <DeployLogo className="h-10 w-auto z-[99] relative" />
        </div>
    );
};
