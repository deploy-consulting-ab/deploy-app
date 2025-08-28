import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tilde",
  description: "Tilde App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${inter.className} antialiased h-full`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <div className="h-full bg-background">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
