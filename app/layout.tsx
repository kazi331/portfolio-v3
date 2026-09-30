import { jsonLd, siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';
import { Fugaz_One, Inter, Playfair_Display, Shrikhand, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-serif',
    display: 'swap',
});

const fugazOne = Fugaz_One({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-fugaz',
    display: 'swap',
});

const shrikhand = Shrikhand({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-shrikhand',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: 'Full Stack Developer | React, Next.js & Node.js Expert',
        template: '%s | Kazi Shariful Islam',
    },
    description: siteConfig.description,
    applicationName: 'Kazi Shariful Islam Portfolio',
    authors: [{ name: 'Kazi Shariful Islam' }],
    creator: 'Kazi Shariful Islam',
    publisher: 'Kazi Shariful Islam',
    keywords: siteConfig.keywords.join(', '),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: 'Full Stack Developer | React, Next.js & Node.js Expert',
        description: siteConfig.description,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: 'Kazi Shariful Islam — Full Stack Developer',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Full Stack Developer | React, Next.js & Node.js Expert',
        description: siteConfig.description,
        creator: siteConfig.twitterHandle,
        site: siteConfig.twitterHandle,
        images: [siteConfig.ogImage],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${fugazOne.variable} ${shrikhand.variable}`}>
            <head>
                <script
                    id="jsonld-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="bg-[#090909] text-[#F5F5F5] antialiased font-sans">
                {children}
            </body>
        </html>
    );
}
