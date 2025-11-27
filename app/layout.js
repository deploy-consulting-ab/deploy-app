import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/auth/form/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

const nunitoSans = Nunito_Sans({ subsets: ['latin'] });

export const metadata = {
    title: 'Tilde',
    description: 'Tilde App',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Tilde',
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            {
                media: '(prefers-color-scheme: light)',
                url: '/images/tilde-black.png',
                sizes: '64x64',
                type: 'image/png',
            },
            {
                media: '(prefers-color-scheme: dark)',
                url: '/images/tilde-white.png',
                sizes: '64x64',
                type: 'image/png',
            },
        ],
        apple: '/images/tilde-black.png',
    },
};

export default async function RootLayout({ children }) {
    const session = await auth();
    return (
        <html lang="en" suppressHydrationWarning className="h-full">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />
            </head>
            <body className={`${nunitoSans.className} antialiased h-full`}>
                <SessionProvider session={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="h-full bg-background">{children}</div>
                    </ThemeProvider>
                </SessionProvider>
                <Analytics />
                <Toaster />
            </body>
        </html>
    );
}
