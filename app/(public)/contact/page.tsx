import ContactView from '@/components/pages/ContactView';
import { siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Kazi Shariful Islam about product engineering, frontend systems, and full-stack development inquiries.',
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteConfig.url}/contact`,
    title: 'Contact | Kazi Shariful Islam',
    description: 'Get in touch with Kazi Shariful Islam about product engineering, frontend systems, and full-stack development inquiries.',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Contact Kazi Shariful Islam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Kazi Shariful Islam',
    description: 'Get in touch with Kazi Shariful Islam about product engineering, frontend systems, and full-stack development inquiries.',
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },
};

export default function ContactPage() {
  return <ContactView />;
}
