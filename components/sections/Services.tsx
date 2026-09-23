'use client';

import React from 'react';
import { services } from '@/lib/data';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import ServiceCard from '@/components/cards/ServiceCard';

export default function Services() {
  return (
    <Section id="services" className="bg-[#0A0C0F] border-b border-white/10 relative py-20">
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none z-0" />
      <Container className="relative z-10">
        <SectionHeading
          title="Full Stack Solutions"
          subtitle="Engineering Services"
          description="Combining advanced React & Next.js frontend engineering with low-latency Node.js, Nest.js, and FastAPI backend architectures to solve complex business bottlenecks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
