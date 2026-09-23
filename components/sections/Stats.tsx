'use client';

import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import { Code2, Cpu, GitCompare, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

interface RichStat {
  id: string;
  value: string;
  label: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const richStats: RichStat[] = [
  {
    id: 'exp',
    value: '03+',
    label: 'Years Experience',
    subtitle: 'System Engineering',
    description: 'Designing modular frontend structures and high-performance server microservices.',
    icon: <Code2 className="w-5 h-5 text-accent" />,
    color: 'rgba(78, 133, 191, 0.12)'
  },
  {
    id: 'projects',
    value: '12+',
    label: 'Projects Completed',
    subtitle: 'Production Deployed',
    description: 'Powering multi-tenant administrative portals, custom dashboards, and real-time backends.',
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    color: 'rgba(16, 185, 129, 0.12)'
  },
  {
    id: 'perf',
    value: '+60%',
    label: 'Performance Gain',
    subtitle: 'Speed & Optimization',
    description: 'Maximized via server-side caching, localized state hydration, and asset budget optimizations.',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    color: 'rgba(245, 158, 11, 0.12)'
  },
  {
    id: 'roundtrips',
    value: '-40%',
    label: 'API Roundtrips',
    subtitle: 'Caching Efficiency',
    description: 'Minimized network latency by fine-tuning stale state queries and persistent cache rules.',
    icon: <GitCompare className="w-5 h-5 text-[#89AACC]" />,
    color: 'rgba(137, 170, 204, 0.12)'
  }
];

export default function Stats() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);


  return (
    <Section id="stats" className="py-16 md:py-20 bg-[#0A0C0F] border-b border-white/10 relative overflow-hidden">
      {/* CAD technical grid line overlay */}
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none z-0" />

      <Container className="relative z-10">

        {/* Modern stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {richStats.map((stat, index) => {
            return (
              <motion.div
                key={stat.id}
                id={`stat-card-${stat.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative p-6 bg-[#11141B] border border-white/10 hover:border-accent/40 rounded-[18px_4px_18px_4px] flex flex-col justify-between h-[210px] md:h-[220px] overflow-hidden group transition-all duration-200 shadow-xl text-left"
              >
                {/* Card Header: Icon & Subtitle */}
                <div className="flex items-center justify-between w-full relative z-10 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#161B24] border border-white/10 rounded-[8px_2px_8px_2px] text-white group-hover:border-accent/30 transition-all duration-200">
                      {stat.icon}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#89AACC] font-semibold">
                      {stat.subtitle}
                    </span>
                  </div>

                  {/* Indicator notch */}
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-white/15 group-hover:bg-accent transition-colors" />
                </div>

                {/* Card Body: Metric Value & Label */}
                <div className="flex flex-col gap-0.5 relative z-10 mt-auto">
                  <span className="text-4xl md:text-5xl font-display font-black text-white group-hover:text-accent transition-colors tracking-tight leading-none">
                    {stat.value}
                  </span>

                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/90 mt-1.5">
                    {stat.label}
                  </span>

                  <p className="text-[11px] leading-relaxed text-muted-text mt-2 font-sans font-normal line-clamp-2">
                    {stat.description}
                  </p>
                </div>

                {/* Subtle top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-accent/40 transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>

      </Container>
    </Section>
  );
}
