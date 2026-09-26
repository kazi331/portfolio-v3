import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import BlogListingView from '@/components/blog/BlogListingView';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Full Stack & React Engineering Blog | Node.js, Next.js & Systems Architecture',
  description: 'Scalable Node.js architectures, Next.js optimization, and FastAPI microservices.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteConfig.url}/blog`,
    title: 'Full Stack & React Engineering Blog | Node.js, Next.js & Systems Architecture',
    description: 'Scalable Node.js architectures, Next.js optimization, and FastAPI microservices.',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Full Stack Engineering Blog — Kazi Shariful Islam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Full Stack & React Engineering Blog | Node.js, Next.js & Systems Architecture',
    description: 'Scalable Node.js architectures, Next.js optimization, and FastAPI microservices.',
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },
};

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="bg-[#090909] min-h-screen" />}>
      <BlogListingView basePath="/blog" />
    </Suspense>
  );
}
