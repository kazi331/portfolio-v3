import Navbar from '@/components/layout/Navbar';
import SmoothScroll from '@/components/shared/SmoothScroll';
import { personalInfo } from '@/lib/data';
import { siteConfig } from '@/lib/seo';
import React from 'react';

export const jsonLd = {
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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </>
  );
}
