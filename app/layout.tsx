import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Playfair_Display, Fugaz_One, Shrikhand } from 'next/font/google';
import SmoothScroll from '@/components/shared/SmoothScroll';
import PageLoader from '@/components/layout/PageLoader';
import { siteConfig } from '@/lib/seo';
import { personalInfo } from '@/lib/data';
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        '@id': `${siteConfig.url}/#person`,
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: personalInfo.name,
      jobTitle: 'Senior Full Stack Developer & Systems Architect',
      url: siteConfig.url,
      email: personalInfo.email,
      image: personalInfo.profileImage,
      sameAs: [personalInfo.github, personalInfo.linkedin],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Full Stack Developer',
        occupationLocation: [
          {
            '@type': 'AdministrativeArea',
            name: 'Remote Worldwide (US, EU, UK, AU, CA, Germany, Japan)',
          },
        ],
        skills: [
          'React',
          'Next.js',
          'TypeScript',
          'JavaScript',
          'Node.js',
          'Express',
          'Nest.js',
          'FastAPI',
          'PostgreSQL',
          'GraphQL',
          'Shopify Functions',
        ],
      },
      knowsAbout: [
        'Full Stack Development',
        'Frontend Architecture',
        'Next.js App Router',
        'React Performance',
        'Node.js Microservices',
        'NestJS Dependency Injection',
        'FastAPI High-Concurrency APIs',
        'TypeScript Strict Typing',
        'PostgreSQL Database Optimization',
        'Shopify Functions & Apps',
        'Remote Engineering Collaboration',
      ],
      description: personalInfo.summary,
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteConfig.url}/#service`,
      name: 'Kazi Shariful Islam — Full Stack Engineering & Consulting',
      url: siteConfig.url,
      priceRange: '$$$',
      areaServed: [
        'United States',
        'European Union',
        'United Kingdom',
        'Australia',
        'Canada',
        'Germany',
        'Japan',
        'Worldwide',
      ],
      availableLanguage: ['English', 'Bengali'],
      serviceType: [
        'Full Stack Web Development',
        'React & Next.js Consulting',
        'Node.js & NestJS API Engineering',
        'FastAPI Microservice Development',
        'Enterprise Web Application Architecture',
        'Shopify App & Storefront Optimization',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '12',
        bestRating: '5',
        worstRating: '1',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${fugazOne.variable} ${shrikhand.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#090909] text-[#F5F5F5] antialiased font-sans">
        <PageLoader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
