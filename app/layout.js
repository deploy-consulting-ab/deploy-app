import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/auth/form/theme-provider';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Tilde',
    description: 'Tilde App',
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
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className="h-full">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                </head>
            <body className={`${inter.className} antialiased h-full`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="h-full bg-background">{children}</div>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
