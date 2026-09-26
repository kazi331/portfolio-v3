import { jsonLd } from '@/app/(public)/layout';
import { siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';
import { Fugaz_One, Inter, Playfair_Display, Shrikhand, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-display',
});

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-serif',
});

const fugazOne = Fugaz_One({
    subsets: ['latin'],
    weight: '400', // Fugaz One only has weight 400 in Google Fonts, but it is naturally heavy (700-like bold style)
    variable: '--font-fugaz',
});

const shrikhand = Shrikhand({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-shrikhand',
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: 'Full Stack Developer| React, Next.js & Node.js Expert',
        template: '%s | Kazi Shariful Islam',
    },
    description: siteConfig.description,
    applicationName: 'Kazi Shariful Islam Portfolio',
    authors: [{ name: 'Kazi Shariful Islam', url: siteConfig.url }],
    creator: 'Kazi Shariful Islam',
    publisher: 'Kazi Shariful Islam',
    keywords: siteConfig.keywords,
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: 'Full Stack Developer| React, Next.js & Node.js Expert',
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
        title: 'Full Stack Developer| React, Next.js & Node.js Expert',
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
