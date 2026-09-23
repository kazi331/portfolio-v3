'use client';

import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import {
  Code,
  Compass,
  GitBranch,
  GraduationCap,
  Navigation,
  Rocket,
  Server,
  Shield,
  Store,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

interface JourneyStep {
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  highlights: {
    icon: React.ReactNode;
    text: string;
  }[];
  // Coordinates for dot placement in percentage of canvas
  dotX: number;
  dotY: number;
  // Coordinates for card placement in percentage of canvas
  cardX: number;
  cardY: number;
  yearLabel: string;
  color: string;
  isCurrent?: boolean;
}

export default function ExperienceV2() {
  const [activeStep, setActiveStep] = useState<number>(3); // Default to current/latest step

  // High fidelity career steps matching Kazi's actual portfolio data from data.ts
  const journeySteps: JourneyStep[] = [
    {
      company: 'Approveage Inc',
      role: 'Frontend Engineer',
      period: '2023',
      duration: '1 yr',
      location: 'Toronto, Canada (Remote)',
      highlights: [
        { icon: <Rocket className="w-3.5 h-3.5" />, text: 'Established real-time data flow with Socket.IO' },
        { icon: <Code className="w-3.5 h-3.5" />, text: 'Integrated Firebase Cloud Messaging push alerts' }
      ],
      dotX: 8,
      dotY: 88,
      cardX: 8,
      cardY: 58,
      yearLabel: '2023',
      color: '#4E85BF',
    },
    {
      company: 'Dhali Overseas',
      role: 'React/Next.js Developer',
      period: '2024',
      duration: '5 mos',
      location: 'Dhaka, Bangladesh',
      highlights: [
        { icon: <Server className="w-3.5 h-3.5" />, text: 'Migrated 3 Webflow projects to Next.js routes' },
        { icon: <GitBranch className="w-3.5 h-3.5" />, text: 'Implemented TanStack Query cutting latency 30%' }
      ],
      dotX: 32.5,
      dotY: 67,
      cardX: 32.5,
      cardY: 41,
      yearLabel: '2024',
      color: '#4E85BF',
    },
    {
      company: 'Tutorsplan Corp',
      role: 'Full Stack Developer',
      period: '2025',
      duration: '1 yr',
      location: 'Dhaka, Bangladesh',
      highlights: [
        { icon: <Store className="w-3.5 h-3.5" />, text: 'Built portal with Next.js/NestJS & PostgreSQL' },
        { icon: <Users className="w-3.5 h-3.5" />, text: 'Led and mentored frontend development team' }
      ],
      dotX: 58.5,
      dotY: 50,
      cardX: 47.5,
      cardY: 18,
      yearLabel: '2025',
      color: '#10B981',
    },
    {
      company: 'Devsnest OPC',
      role: 'Software Engineer',
      period: 'Now',
      duration: 'Present',
      location: 'Dhaka, Bangladesh',
      highlights: [
        { icon: <Compass className="w-3.5 h-3.5" />, text: 'Solo-built live Mixory Bundles Shopify app' },
        { icon: <GraduationCap className="w-3.5 h-3.5" />, text: 'Authored Shopify discount functions in Rust' },
        { icon: <Shield className="w-3.5 h-3.5" />, text: 'Ships scalable TypeScript at production scale' }
      ],
      dotX: 73.5,
      dotY: 30,
      cardX: 73.5,
      cardY: 4,
      yearLabel: 'Now',
      color: '#10B981',
      isCurrent: true,
    }
  ];

  // Dynamic progress values mapping to steps (matching 72% for step 3 to align with mockup)
  const progressMap = [25, 48, 72, 100];
  const activePercent = progressMap[activeStep];

  return (
    <Section id="experience" className="bg-[#0A0C0F] border-b border-white/10 relative py-20 overflow-hidden">
      {/* Technical CAD line grid */}
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none z-0" />

      <Container className="relative z-10">

        {/* Header Block matching mockup layout */}
        <div className="max-w-6xl mx-auto mb-14 text-left">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-5 h-[2px] bg-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
              THE ASCENT
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-[#F5F5F5] mb-4">
            Experience Journey
          </h2>
          <p className="text-sm font-sans text-muted-text max-w-2xl leading-relaxed mb-6">
            A climb through roles — each waypoint a step toward greater ownership, leadership, and shipping production software end-to-end.
          </p>

          {/* Interactive Monospace Years Row: 2023 2024 2025 Now */}
          <div className="flex items-center gap-1 font-mono text-[11px] font-semibold tracking-tight select-none border-b border-white/10 pb-2 inline-flex">
            {journeySteps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`transition-all duration-200 px-2.5 py-1 rounded-[6px_2px_6px_2px] cursor-pointer focus:outline-none relative ${isActive
                    ? 'text-accent bg-accent/15 border border-accent/30 font-bold'
                    : 'text-muted-text/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {step.yearLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Waypoints Canvas Board */}
        <div className="hidden lg:block relative w-full h-[640px] bg-[#0E1218] border border-white/10 rounded-[24px_6px_24px_6px] overflow-hidden shadow-2xl">

          {/* Constellation lines and tracks */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3E78B2" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#7FA3C7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="activeTrack" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3E78B2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Faint static background track */}
            <path
              d="M 8 88 C 15 80, 22 73, 29.5 69 C 38 63, 45 59, 53.5 55 C 61 47, 67 37, 73.5 30"
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="0.25"
              strokeDasharray="0.5 0.75"
            />

            {/* Glowing trace line up to active dot */}
            <motion.path
              d="M 8 88 C 15 80, 22 73, 29.5 69 C 38 63, 45 59, 53.5 55 C 61 47, 67 37, 73.5 30"
              fill="none"
              stroke="url(#activeTrack)"
              strokeWidth="0.3"
              strokeLinecap="round"
              pathLength={100}
              initial={{ strokeDasharray: '0 100' }}
              animate={{
                strokeDasharray: `${(activeStep / (journeySteps.length - 1)) * 100} 100`
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </svg>

          {/* Render Dots & Cards */}
          <div className="absolute inset-0 z-10">
            {journeySteps.map((step, idx) => {
              const isActive = activeStep === idx;

              return (
                <React.Fragment key={idx}>
                  {/* Waypoint Dot */}
                  <div
                    onClick={() => setActiveStep(idx)}
                    className="absolute cursor-pointer transition-all duration-300 z-20 group"
                    style={{
                      left: `${step.dotX}%`,
                      top: `${step.dotY}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Ring glow for active or hovered dot */}
                    <div
                      style={{ borderColor: step.color }}
                      className={`absolute -inset-4 rounded-full border transition-all duration-500 ${isActive
                        ? 'scale-125 opacity-100 border-2'
                        : 'scale-75 opacity-0 group-hover:opacity-45 group-hover:scale-100'
                        }`}
                    />

                    {/* Concentric rings for lead green dot */}
                    {step.isCurrent && isActive && (
                      <div className="absolute -inset-6 rounded-full border border-emerald-400/25 animate-ping pointer-events-none" />
                    )}

                    {/* Core node dot */}
                    <div
                      style={{ backgroundColor: step.color }}
                      className={`w-4 h-4 rounded-[4px_1px_4px_1px] border-2 border-[#0A0C0F] shadow-lg shadow-black/80 transition-all duration-200 ${isActive ? 'scale-125' : 'scale-100 hover:scale-110'
                        }`}
                    />
                  </div>

                  {/* Waypoint Card Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      left: `${step.cardX}%`,
                      top: `${step.cardY}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute w-[290px] p-5 rounded-[18px_4px_18px_4px] border transition-all duration-200 text-left cursor-pointer ${isActive
                      ? 'bg-[#11141B] border-accent/50 shadow-2xl shadow-black/90 scale-102 ring-1 ring-accent/20 z-[11]'
                      : 'bg-[#11141B]/70 border-white/10 hover:border-white/20 opacity-70 hover:opacity-95'
                      }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider">
                        {step.company}
                      </span>
                      {step.isCurrent ? (
                        <span className="font-mono text-[9px] bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-[6px_2px_6px_2px] text-emerald-400 font-bold">
                          Now
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] text-muted-text/80">
                          {step.period} · {step.duration}
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h4 className="font-sans font-bold text-[14px] text-[#F5F5F5] mt-3 tracking-tight">
                      {step.role}
                    </h4>

                    {/* Bullet Highlights */}
                    <div className="mt-4 space-y-3">
                      {step.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5 text-[11px] text-muted-text leading-relaxed">
                          <span className="mt-0.5 text-emerald-400 shrink-0">
                            {h.icon}
                          </span>
                          <span>{h.text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Bottom Journey Navigation Bar */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-20 font-mono text-[11px]">
            <span className="text-muted-text text-[10px]">Select year to inspect waypoint</span>

            {/* Ascent status progress bar */}
            <div className="flex items-center gap-4 w-64">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 rotate-45" />
              <div className="h-[3px] bg-white/10 rounded-sm flex-1 overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: '0%' }}
                  animate={{ width: `${activePercent}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="font-bold text-[#F5F5F5] min-w-[32px] text-right">
                {activePercent}%
              </span>
            </div>
          </div>

        </div>

        {/* Responsive Mobile/Tablet Layout (Tidily stacked & scrollable) */}
        <div className="lg:hidden space-y-5 max-w-xl mx-auto">
          {journeySteps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-[18px_4px_18px_4px] border transition-all duration-200 text-left relative cursor-pointer ${isActive
                  ? 'bg-[#11141B] border-accent/50 shadow-xl'
                  : 'bg-[#11141B]/70 border-white/10 opacity-85'
                  }`}
              >
                {/* Meta details */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-[2px] ${isActive ? 'bg-accent' : 'bg-white/20'}`} />
                    <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
                      {step.company}
                    </span>
                  </div>
                  {step.isCurrent ? (
                    <span className="font-mono text-[10px] bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-[6px_2px_6px_2px] text-emerald-400 font-bold">
                      Now
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-muted-text/80">
                      {step.period} · {step.duration}
                    </span>
                  )}
                </div>

                {/* Role Title */}
                <h4 className="font-sans font-bold text-base text-[#F5F5F5] mt-3 tracking-tight">
                  {step.role}
                </h4>

                {/* Highlights */}
                <div className="mt-4 space-y-3">
                  {step.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-[12px] text-muted-text leading-relaxed">
                      <span className="mt-0.5 text-emerald-400 shrink-0">
                        {h.icon}
                      </span>
                      <span>{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Mobile indicator row */}
          <div className="flex items-center justify-between pt-4 font-mono text-[11px] text-muted-text/80 px-2">
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 rotate-45" />
              <span>Tap a card to inspect waypoint</span>
            </div>
            <div className="font-bold text-[#F5F5F5]">
              {activePercent}% Completed
            </div>
          </div>
        </div>

      </Container>
    </Section>
  );
}
