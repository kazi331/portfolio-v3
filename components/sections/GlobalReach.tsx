'use client';

import React from 'react';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import { Globe, Clock, ShieldCheck, Zap, Laptop, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const regions = [
  {
    name: 'United States & Canada',
    flag: '🇺🇸 🇨🇦',
    overlap: '4–6 hrs EST / CST / PST overlap',
    details: 'Daily standups, synchronous sprint planning, and async documentation handoffs.',
  },
  {
    name: 'United Kingdom & European Union',
    flag: '🇬🇧 🇪🇺',
    overlap: 'Full day overlap (GMT / CET)',
    details: 'Real-time pairing, agile PR reviews, and frictionless Slack/Discord collaboration.',
  },
  {
    name: 'Germany & Northern Europe',
    flag: '🇩🇪 🇸🇪',
    overlap: '5–7 hrs CET overlap',
    details: 'Strict GDPR-conscious code architecture and structured type-safe systems.',
  },
  {
    name: 'Australia & Japan',
    flag: '🇦🇺 🇯🇵',
    overlap: 'Full afternoon / evening overlap (AEST / JST)',
    details: 'Convenient timezone alignment for live reviews, demos, and instant support.',
  },
];

const pillars = [
  {
    icon: <Clock className="w-5 h-5 text-accent" />,
    title: 'High-Touch Async & Sync Comm',
    description: 'Detailed GitHub PR descriptions, Loom walk-throughs, and prompt Slack responses eliminate blocker cycles across time zones.',
  },
  {
    icon: <Laptop className="w-5 h-5 text-[#89AACC]" />,
    title: 'Autonomous Execution',
    description: 'Self-directed full-stack delivery from product PRD to tested production rollout without requiring constant hand-holding.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
    title: 'Contract & Invoice Ready',
    description: 'Seamless international invoicing, B2B contractor agreements, and IP assignment protection for venture-backed and enterprise teams.',
  },
  {
    icon: <Zap className="w-5 h-5 text-accent" />,
    title: 'Rapid Onboarding',
    description: 'Spinning up environments quickly with Docker, TypeScript type definitions, and clean architecture patterns in under 48 hours.',
  },
];

export default function GlobalReach() {
  return (
    <Section id="global-reach" className="bg-[#0b0b0b] border-t border-b border-white/5 py-20 md:py-28 relative">
      <Container>
        <SectionHeading
          title="Remote Developer for Global Teams"
          subtitle="International Availability"
          description="Available for full-time remote roles, fractional technical leadership, and contract engineering for companies across EU, US, AU, CA, UK, Germany, and Japan."
        />

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 rounded-[24px] bg-[#121212]/90 border border-white/5 hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-3">{region.flag}</div>
                <h3 className="font-display font-bold text-base text-white mb-1.5">
                  {region.name}
                </h3>
                <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-3">
                  {region.overlap}
                </div>
                <p className="text-xs text-muted-text leading-relaxed">
                  {region.details}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Operational Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/5">
          {pillars.map((pillar, index) => (
            <div key={pillar.title} className="flex flex-col items-start text-left">
              <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 mb-3.5">
                {pillar.icon}
              </div>
              <h4 className="font-sans font-semibold text-sm text-white mb-2">
                {pillar.title}
              </h4>
              <p className="text-xs text-muted-text leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Global CTA Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-accent/10 via-white/3 to-transparent border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base">
                Looking for a Senior React, Next.js, or Full Stack Developer?
              </p>
              <p className="text-xs text-muted-text">
                Available immediately for remote international contracts and full-time engineering engagements.
              </p>
            </div>
          </div>
          <a
            href="#contact-cta"
            className="px-6 py-3 bg-accent text-primary-bg rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-accent/90 shrink-0 flex items-center gap-2"
          >
            <span>Contact</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Container>
    </Section>
  );
}
