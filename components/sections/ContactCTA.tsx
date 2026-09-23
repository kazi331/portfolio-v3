'use client';

import AnimatedButton from '@/components/buttons/AnimatedButton';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import { personalInfo } from '@/lib/data';
import { Calendar, Mail } from 'lucide-react';

export default function ContactCTA() {
  return (
    <Section id="contact-cta" className="py-20 md:py-28 relative overflow-hidden bg-[#0A0C0F] border-b border-white/10">
      {/* Technical CAD line grid */}
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none z-0" />

      <Container className="relative z-10">
        <div className="border border-white/15 bg-[#0E1218] rounded-[24px_6px_24px_6px] p-8 md:p-16 text-center max-w-4xl mx-auto flex flex-col items-center relative overflow-hidden shadow-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-accent font-mono mb-4 block font-semibold">
            Work with Me
          </span>

          <h3 className="text-3xl md:text-5xl font-serif text-[#F5F5F5] mb-4 font-normal tracking-tight max-w-2xl leading-tight">
            Have a project in mind? Let&apos;s build something <span className="italic font-light text-accent-secondary">resilient</span>.
          </h3>

          <p className="text-muted-text text-xs md:text-sm max-w-lg leading-relaxed mb-10 font-sans">
            I am currently accepting selective system reviews, code audits, and full stack project consulting agreements. Let&apos;s map your system requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative z-10">
            <AnimatedButton variant="primary" href={`mailto:${personalInfo.email}`} className="w-full sm:w-auto px-8">
              <Mail className="w-4 h-4 mr-1.5" />
              Get in Touch
            </AnimatedButton>
            <AnimatedButton variant="outline" href="https://calendly.com" className="w-full sm:w-auto px-8">
              <Calendar className="w-4 h-4 mr-1.5" />
              Book Architecture Audit
            </AnimatedButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
