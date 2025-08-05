import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata = {
    title: 'Class Up',
    description: 'The best for your classroom management',
    icons: {
        icon: '/favicon.ico',
    },
};

export default async function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} h-screen flex flex-col antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
