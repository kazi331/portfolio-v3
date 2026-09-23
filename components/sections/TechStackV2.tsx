'use client';

import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import { Cpu, Database, Layout, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import MobileSphereTechStack from './MobileSphereTechStack';

export interface TechnologyNode {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tooling';
  type: 'core' | 'data' | 'learning';
  experience: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  size: number; // multiplier for size
  color: string; // Tailwind color string for hover glows
  description: string;
  icon: React.ReactNode;
}

// High fidelity technical constellation mapping based on user's reference mockup
const technologies: TechnologyNode[] = [
  {
    name: 'JavaScript',
    category: 'frontend',
    type: 'core',
    experience: '4 yrs exp',
    x: 48,
    y: 40,
    size: 1.4,
    color: 'rgba(78, 196, 191, 0.4)',
    description: 'Building interactive applications with modern ES6+ features, async patterns, and DOM manipulation. Mastering closures, prototypes, and event-driven architectures.',
    icon: <Layout className="w-5 h-5" />,
  },
  {
    name: 'React',
    category: 'frontend',
    type: 'core',
    experience: '4 yrs exp',
    x: 50,
    y: 20,
    size: 1.4,
    color: 'rgba(78, 196, 191, 0.4)',
    description: 'Architecting dynamic, responsive UI architectures using declarative component trees, customized hydration strategies, and advanced hook lifecycles.',
    icon: <Layout className="w-5 h-5" />,
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    type: 'core',
    experience: '4 yrs exp',
    x: 32,
    y: 35,
    size: 1.2,
    color: 'rgba(78, 133, 191, 0.4)',
    description: 'Enforcing robust, compile-time strict type safety across full-stack applications. Authoring highly reusable generic interfaces and automated mapping utilities.',
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    name: 'Node.js',
    category: 'backend',
    type: 'core',
    experience: '3 yrs exp',
    x: 68,
    y: 35,
    size: 1.2,
    color: 'rgba(78, 196, 191, 0.4)',
    description: 'Designing highly concurrent runtime environments, implementing custom event loops, cluster load management, and memory-safe stream pipelines.',
    icon: <Cpu className="w-4 h-4" />,
  },
  {
    name: 'Next.js',
    category: 'frontend',
    type: 'core',
    experience: '4 yrs exp',
    x: 18,
    y: 42,
    size: 1.0,
    color: 'rgba(255, 255, 255, 0.2)',
    description: 'Optimizing application performance via Server Components, Incremental Static Regeneration (ISR), static bails, and edge route execution.',
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    name: 'PostgreSQL',
    category: 'database',
    type: 'data',
    experience: '3 yrs exp',
    x: 24,
    y: 60,
    size: 1.15,
    color: 'rgba(16, 185, 129, 0.4)',
    description: 'Authoring highly optimized schema layouts, custom relational index architectures, nested queries, and handling concurrent transaction locking models.',
    icon: <Database className="w-4 h-4" />,
  },
  {
    name: 'NestJS',
    category: 'backend',
    type: 'core',
    experience: '2 yrs exp',
    x: 82,
    y: 44,
    size: 1.1,
    color: 'rgba(78, 133, 191, 0.4)',
    description: 'Architecting scalable, modular backend services with declarative dependency injection, strict interceptors, custom filters, and robust domain separation.',
    icon: <Cpu className="w-4 h-4" />,
  },
  {
    name: 'GraphQL',
    category: 'tooling',
    type: 'core',
    experience: '1 yrs exp',
    x: 50,
    y: 76,
    size: 0.95,
    color: 'rgba(139, 92, 246, 0.4)',
    description: 'Designing unified gateway graphs with granular query execution paths, batching resolvers via DataLoader, and custom storefront queries.',
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    name: 'MongoDB',
    category: 'database',
    type: 'data',
    experience: '2 yrs exp',
    x: 34,
    y: 72,
    size: 0.95,
    color: 'rgba(16, 185, 129, 0.4)',
    description: 'Modeling high-throughput non-relational document trees with nested collections, writing aggregation pipes, and tuning cluster sharding strategies.',
    icon: <Database className="w-4 h-4" />,
  },
  {
    name: 'Prisma',
    category: 'database',
    type: 'data',
    experience: '2 yrs exp',
    x: 74,
    y: 58,
    size: 0.9,
    color: 'rgba(16, 185, 129, 0.4)',
    description: 'Writing robust schema declarations, auto-generating relational types, migrating database structures safely, and profiling query response times.',
    icon: <Database className="w-4 h-4" />,
  },
  {
    name: 'Shopify',
    category: 'tooling',
    type: 'learning',
    experience: '1 yrs exp',
    x: 64,
    y: 74,
    size: 0.95,
    color: 'rgba(16, 185, 129, 0.4)',
    description: 'Solo-architecting customized embedded Shopify apps, writing cart-transform Shopify Functions in Rust/JS, and optimizing Checkout UI extensions.',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: 'React Native',
    category: 'frontend',
    type: 'core',
    experience: '2 yrs exp',
    x: 13,
    y: 66,
    size: 0.9,
    color: 'rgba(78, 133, 191, 0.4)',
    description: 'Building cross-platform mobile frameworks with native bridges, performance-tuned lists, fast layouts, and localized local cache layers.',
    icon: <Layout className="w-4 h-4" />,
  },
  {
    name: 'Python',
    category: 'backend',
    type: 'learning',
    experience: '1 yrs exp',
    x: 76,
    y: 78,
    size: 0.85,
    color: 'rgba(234, 179, 8, 0.4)',
    description: 'Building Python automation, service logic, and backend tooling with async workflows, clean abstractions, and fast data processing patterns.',
    icon: <Cpu className="w-4 h-4" />,
  },
  {
    name: 'FastAPI',
    category: 'backend',
    type: 'learning',
    experience: '1 yrs exp',
    x: 86,
    y: 68,
    size: 0.85,
    color: 'rgba(234, 179, 8, 0.4)',
    description: 'Building FastAPI REST APIs with async endpoints, Pydantic validation, dependency injection, and efficient routing for scalable backend services.',
    icon: <Cpu className="w-4 h-4" />,
  }
];


export default function TechStackV2() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'frontend' | 'backend' | 'database' | 'tooling'>('all');
  const [hoveredNode, setHoveredNode] = useState<TechnologyNode | null>(null);
  const [selectedMobileTech, setSelectedMobileTech] = useState<TechnologyNode | null>(null);
  const [popoverPos, setPopoverPos] = useState({ left: 0, top: 0 });
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [desktopViewMode, setDesktopViewMode] = useState<'constellation' | 'globe'>('constellation');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop, { passive: true });
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clientWidth = containerRef.current.clientWidth;
    const clientHeight = containerRef.current.clientHeight;

    const xOffset = x > clientWidth * 0.6 ? -340 : 20;
    const yOffset = y > clientHeight * 0.6 ? -220 : 20;

    const left = Math.min(Math.max(16, x + xOffset), clientWidth - 336);
    const top = Math.min(Math.max(16, y + yOffset), clientHeight - 240);

    setPopoverPos({ left, top });
  };


  const filteredTechnologies = technologies.filter(
    (tech) => activeFilter === 'all' || tech.category === activeFilter
  );

  return (
    <Section id="tech-stack" className="bg-[#0A0C0F] border-b border-white/10 relative py-20 overflow-hidden">
      <div id="stack" className="absolute top-0 left-0 pointer-events-none" />
      
      {/* Technical CAD line grid */}
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none z-0" />

      <Container className="relative z-10">

        {/* Header Block with Sparkle Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-6xl mx-auto mb-6 md:mb-8">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-[2px]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#89AACC] font-semibold">
                SKILLS & ARCHITECTURE
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-[#F5F5F5]">
              Toolkit & Ecosystem
            </h2>
            <p className="text-sm font-sans text-muted-text max-w-xl hidden md:block">
              Hover over each node to explore my interactive technical constellation.
            </p>
            <p className="text-sm font-sans text-muted-text max-w-xl md:hidden">
              Rotate the interactive 3D constellation with touch to explore my technical skills.
            </p>
          </div>

          {/* Controls at Top Right */}
          <div className="hidden md:flex items-center gap-3 self-start md:self-auto">
            {/* View Switcher: 2D Constellation vs 3D Orbital Globe */}
            <div className="flex items-center p-1 bg-[#141820] border border-white/10 rounded-[8px_2px_8px_2px]">
              <button
                onClick={() => setDesktopViewMode('constellation')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px_2px_6px_2px] font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  desktopViewMode === 'constellation'
                    ? 'bg-accent/20 text-accent border border-accent/40 font-semibold'
                    : 'text-muted-text hover:text-white'
                }`}
              >
                <span>2D Map</span>
              </button>
              <button
                onClick={() => setDesktopViewMode('globe')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px_2px_6px_2px] font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  desktopViewMode === 'globe'
                    ? 'bg-accent/20 text-accent border border-accent/40 font-semibold'
                    : 'text-muted-text hover:text-white'
                }`}
              >
                <span>3D Orbital</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#141820] border border-white/10 rounded-[8px_2px_8px_2px] shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono text-xs font-semibold text-[#F5F5F5]">
                16 technologies mapped
              </span>
            </div>
          </div>
        </div>

        {/* Constellation Canvas Board or 3D Orbital Globe (Desktop/Tablet) */}
        {isDesktop && desktopViewMode === 'constellation' && (
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="hidden md:flex relative w-full min-h-[560px] md:min-h-[640px] bg-[#0E1218] border border-white/10 rounded-[24px_6px_24px_6px] p-6 overflow-hidden flex-col shadow-2xl"
          >
            {/* Top Controls row: Filter Pills on left, Legend Dots on right */}
            <div id="tech-stack-controls" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 relative z-20">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-muted-text/80 tracking-widest font-semibold mr-1">
                  FILTER:
                </span>
                {(['all', 'frontend', 'backend', 'database', 'tooling'] as const).map((cat) => {
                  const isSelected = activeFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-[8px_2px_8px_2px] text-[10px] font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${isSelected
                        ? 'bg-accent/15 text-accent border border-accent/40 shadow-sm'
                        : 'bg-[#141820] border border-white/10 text-muted-text hover:text-[#F5F5F5] hover:bg-[#1A202A]'
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Legend Indicators */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-[2px] bg-[#3E78B2]" />
                  <span className="font-sans text-[11px] text-muted-text font-medium">Core</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-[2px] bg-[#10B981]" />
                  <span className="font-sans text-[11px] text-muted-text font-medium">Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
                  <span className="font-sans text-[11px] text-muted-text font-medium">Learning</span>
                </div>
              </div>
            </div>

            {/* Subtle connecting mesh lines using SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 z-0" xmlns="http://www.w3.org/2000/svg">
              {/* Center Node (React) connected to others */}
              {filteredTechnologies.map((tech, idx) => {
                if (tech.name === 'React') return null;
                return (
                  <motion.line
                    key={`line-${idx}`}
                    x1={`${50}%`}
                    y1={`${50}%`}
                    x2={`${tech.x}%`}
                    y2={`${tech.y}%`}
                    stroke="rgba(137, 170, 204, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -20 }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  />
                );
              })}

              {/* Some manual connections for extra constellation vibe */}
              <line x1="32%" y1="35%" x2="18%" y2="42%" stroke="rgba(137, 170, 204, 0.3)" strokeWidth="1" />
              <line x1="68%" y1="35%" x2="82%" y2="44%" stroke="rgba(137, 170, 204, 0.3)" strokeWidth="1" />
              <line x1="32%" y1="35%" x2="24%" y2="60%" stroke="rgba(137, 170, 204, 0.3)" strokeWidth="1" />
              <line x1="68%" y1="35%" x2="74%" y2="58%" stroke="rgba(137, 170, 204, 0.3)" strokeWidth="1" />
              <line x1="24%" y1="60%" x2="34%" y2="72%" stroke="rgba(137, 170, 204, 0.3)" strokeWidth="1" />
              <line x1="74%" y1="58%" x2="64%" y2="74%" stroke="rgba(137, 170, 204, 0.3)" strokeWidth="1" />
            </svg>

            {/* Floating constellation nodes */}
            <div className="absolute inset-0 z-10">
              {filteredTechnologies.map((tech) => {
                const isHovered = hoveredNode?.name === tech.name;
                const isFilteredOut = activeFilter !== 'all' && tech.category !== activeFilter;

                // Position offsets based on sizing
                const nodeSize = 74 * tech.size;

                return (
                  <motion.div
                    key={tech.name}
                    style={{
                      left: `${tech.x}%`,
                      top: `${tech.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute cursor-pointer select-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isFilteredOut ? 0.25 : 1,
                      scale: isFilteredOut ? 0.9 : 1,
                      y: [0, Math.sin(tech.x + tech.y) * 6, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      y: {
                        repeat: Infinity,
                        duration: 4 + (tech.x % 3),
                        ease: 'easeInOut',
                      }
                    }}
                    onMouseEnter={() => setHoveredNode(tech)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Sharp backing ring on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          layoutId="glow-ring"
                          className="absolute inset-0 rounded-full pointer-events-none border border-accent/40 bg-accent/5"
                          style={{
                            scale: 1.25,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Primary Node Sphere */}
                    <div
                      style={{
                        width: `${nodeSize}px`,
                        height: `${nodeSize}px`,
                      }}
                      className={`rounded-full border transition-all duration-200 flex flex-col items-center justify-center text-center ${isHovered
                        ? 'border-accent bg-[#161B24] scale-105 shadow-xl'
                        : tech.type === 'core'
                          ? 'border-[#3E78B2]/30 bg-[#11141B] hover:border-accent'
                          : tech.type === 'data'
                            ? 'border-[#10B981]/30 bg-[#11141B] hover:border-[#10B981]'
                            : 'border-amber-500/30 bg-[#11141B] hover:border-amber-500'
                        }`}
                    >
                      {/* Tiny Icon */}
                      <div className={`transition-transform duration-200 ${isHovered ? 'scale-110 text-accent' : 'text-muted-text/70'}`}>
                        {tech.icon}
                      </div>

                      {/* Node Text Name */}
                      <span className="font-sans font-bold text-[11px] text-[#F5F5F5] mt-1 tracking-tight">
                        {tech.name}
                      </span>

                      {/* Experience Subtext */}
                      {tech.size >= 1.0 && (
                        <span className="font-mono text-[8px] text-muted-text mt-0.5 uppercase tracking-wider font-semibold">
                          {tech.experience.split(' ')[0]} yrs
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Absolute High-Fidelity Hover Popup Detail Card */}
            <AnimatePresence>
              {hoveredNode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: `${popoverPos.left}px`,
                    top: `${popoverPos.top}px`,
                  }}
                  className="z-30 pointer-events-none w-80 max-w-full bg-[#11141B] border border-white/15 rounded-[18px_4px_18px_4px] p-5 shadow-2xl"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className={`p-2.5 rounded-[8px_2px_8px_2px] border flex items-center justify-center shrink-0 ${hoveredNode.type === 'core'
                      ? 'bg-accent/15 border-accent/30 text-accent'
                      : hoveredNode.type === 'data'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      }`}>
                      {hoveredNode.icon}
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-base text-[#F5F5F5]">
                        {hoveredNode.name}
                      </h4>
                      <p className="font-mono text-[10px] text-muted-text uppercase font-semibold mt-0.5 tracking-wider">
                        {hoveredNode.experience}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-text mt-3.5 leading-relaxed font-sans border-t border-white/10 pt-3.5 text-left">
                    {hoveredNode.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-[9px] font-mono text-muted-text bg-[#161B24] py-1.5 px-3 rounded-[6px_2px_6px_2px] border border-white/10 justify-start">
                    <span className="w-1.5 h-1.5 rounded-[2px] bg-accent" />
                    <span>Domain: <strong className="text-[#F5F5F5] uppercase">{hoveredNode.category}</strong></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* 3D Orbital Globe (Desktop/Tablet View) */}
        {isDesktop && desktopViewMode === 'globe' && (
          <div className="hidden md:flex flex-col items-center justify-center relative w-full min-h-[560px] md:min-h-[640px] bg-[#0E1218] border border-white/10 rounded-[24px_6px_24px_6px] p-8 overflow-hidden shadow-2xl">
            <div className="w-full max-w-xl flex flex-col items-center">
              <MobileSphereTechStack />
            </div>
          </div>
        )}

        {/* Mobile View - Both 3D Orbital Constellation & Full Stack Index with Filter */}
        <div className="md:hidden space-y-6 select-none">
          {/* 1. 3D Orbital Constellation */}
          <MobileSphereTechStack />

          {/* 2. Full Tech Stack Browser with Domain Filter */}
          {/* <MobileTechStackBrowser activeFilter={activeFilter} filteredTechnologies={filteredTechnologies} setActiveFilter={setActiveFilter} setSelectedMobileTech={setSelectedMobileTech} technologies={technologies} selectedMobileTech={selectedMobileTech} /> */}

        </div>

      </Container>
    </Section>
  );
}
