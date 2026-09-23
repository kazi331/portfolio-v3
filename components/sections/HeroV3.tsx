'use client';

import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import {
  ArrowRight,
  Cpu,
  Database,
  Layers,
  Network,
  Server,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

interface SystemNode {
  id: string;
  label: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  specs: string[];
  x: number; // grid column layout
  y: number; // grid row layout
}

interface HeroV3Props {
  isLoaded?: boolean;
}

export default function HeroV3({ isLoaded = true }: HeroV3Props) {
  const [activeSystemNode, setActiveSystemNode] = useState<string>('edge');
  const [systemTraceActive, setSystemTraceActive] = useState<boolean>(true);

  const handleScrollToProjects = () => {
    const el = document.getElementById('featured-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Interactive System Nodes mapping to a live full-stack request pipeline
  const systemNodes: SystemNode[] = [
    {
      id: 'client',
      label: 'Interactive Client',
      role: 'Optimized Hydration',
      icon: <Layers className="w-4 h-4" />,
      color: '#4E85BF',
      specs: [
        'React 19 / Next.js Client Shell',
        'State Preserving Micro-Animations',
        'Optimized Touch Target Matrices',
        'Fluid Mobile Responsive Scaling'
      ],
      x: 15,
      y: 20
    },
    {
      id: 'edge',
      label: 'Edge Gateway (SSR)',
      role: 'Server Components',
      icon: <Cpu className="w-4 h-4" />,
      color: '#10B981',
      specs: [
        'Next.js Route Handlers',
        'Dynamic Server Side Rendering',
        'JWT Header Authorization Guards',
        'Incremental Re-generation (ISR)'
      ],
      x: 50,
      y: 40
    },
    {
      id: 'api',
      label: 'NestJS / Backend API',
      role: 'Structured Controller',
      icon: <Server className="w-4 h-4" />,
      color: '#89AACC',
      specs: [
        'Modular Dependency Injection',
        'REST Controller Routing Pipelines',
        'DTO Guard Validation Schemas',
        'Real-time Socket.IO Handshakes'
      ],
      x: 50,
      y: 80
    },
    {
      id: 'db',
      label: 'PostgreSQL DB Engine',
      role: 'Durable Persistence',
      icon: <Database className="w-4 h-4" />,
      color: '#F59E0B',
      specs: [
        'Relational Data Normalization',
        'Prisma Schema Migrations',
        'Optimized Key-Value Indexing',
        'Transaction Rollback Safety'
      ],
      x: 85,
      y: 60
    }
  ];

  const currentActiveNode = systemNodes.find(node => node.id === activeSystemNode) || systemNodes[1];

  // Mobile-optimized entrance animation container with fast springiness
  const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <Section id="hero" className="min-h-screen flex flex-col justify-center pt-32 pb-20 bg-[#0A0C0F] relative overflow-hidden border-b border-white/10">

      {/* Crisp technical CAD grid texture */}
      <div className="absolute inset-0 tech-grid opacity-70 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0C0F]/50 to-[#0A0C0F] pointer-events-none z-0" />

      <Container className="relative z-10 w-full">
        <motion.div
          variants={parentVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Monumental Headline Typography */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">

            {/* Status Live Tag */}
            <motion.div
              variants={childVariants}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141820] border border-white/10 rounded-[8px_2px_8px_2px] mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#89AACC]">
                System Runtime // Online
              </span>
            </motion.div>

            {/* Monumental, staggered headings */}
            <div className="space-y-4 mb-8">
              <motion.div variants={childVariants} className="overflow-hidden">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 block mb-1">
                  INTRODUCING
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-none">
                  Kazi Shariful Islam
                </h1>
              </motion.div>

              <motion.div variants={childVariants} className="overflow-hidden">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-light tracking-tight text-muted-text leading-tight">
                  Full Stack Developer & <br />
                  <span className="font-serif italic text-accent font-normal tracking-wide">
                    Systems Architect
                  </span>
                </h2>
              </motion.div>
            </div>

            {/* Short editorial description */}
            <motion.p
              variants={childVariants}
              className="text-sm text-muted-text/90 leading-relaxed font-sans max-w-lg mb-10"
            >
              I engineer performant web architectures using Next.js and React paired with robust, modular backend systems in NestJS, Node.js, and Python (FastAPI). Focused on pristine UX, clean API designs, and scalable relational databases.
            </motion.p>

            {/* Tech tag loop with unique asymmetric chips */}
            <motion.div
              variants={childVariants}
              className="flex flex-wrap gap-2 mb-10 max-w-md"
            >
              {['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript', 'Prisma ORM', 'FastAPI', 'Redis'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#141820] border border-white/10 hover:border-accent/40 rounded-[6px_2px_6px_2px] font-mono text-[10px] font-medium text-muted-text hover:text-white transition-colors"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              variants={childVariants}
              className="flex flex-wrap gap-3.5 items-center w-full sm:w-auto"
            >
              <button
                onClick={handleScrollToProjects}
                className="px-5 py-3 bg-[#F1F3F5] text-[#0A0C0F] hover:bg-white border border-[#F1F3F5] rounded-[12px_3px_12px_3px] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center gap-2 group cursor-pointer w-full sm:w-auto justify-center active:translate-y-[1px]"
              >
                <span>View Engineering Work</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="/contact"
                className="px-5 py-3 bg-[#141820] border border-white/15 hover:border-accent/50 hover:bg-[#1A202A] text-primary-text rounded-[12px_3px_12px_3px] font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center active:translate-y-[1px]"
              >
                <span>Connect</span>
                <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald-400" />
              </a>
            </motion.div>

          </div>

          {/* Right Column: High Fidelity Interactive System Blueprint */}
          <div className="lg:col-span-6 relative w-full flex flex-col justify-center">

            <motion.div
              variants={childVariants}
              className="w-full bg-[#11141B] border border-white/10 rounded-[24px_6px_24px_6px] p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Header inside Blueprint */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Network className="w-4 h-4 text-accent" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F5F5F5]">
                    System Architecture Trace
                  </span>
                </div>
                <button
                  onClick={() => setSystemTraceActive(!systemTraceActive)}
                  className={`px-2.5 py-1 rounded-[6px_2px_6px_2px] font-mono text-[8px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${systemTraceActive
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-[#161B24] border-white/10 text-muted-text'
                    }`}
                >
                  {systemTraceActive ? 'Live Trace On' : 'Paused'}
                </button>
              </div>

              {/* Graphical Blueprint Grid */}
              <div className="relative w-full h-48 bg-[#0A0C0F] border border-white/10 rounded-[14px_3px_14px_3px] p-4 flex items-center justify-between overflow-hidden">

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                  {/* Dynamic path trace */}
                  <path
                    d="M 40 96 C 100 40, 140 40, 180 96 C 220 150, 260 150, 320 96"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                  />

                  {systemTraceActive && (
                    <motion.path
                      d="M 40 96 C 100 40, 140 40, 180 96 C 220 150, 260 150, 320 96"
                      fill="none"
                      stroke="url(#traceGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 400' }}
                      animate={{ strokeDasharray: '400 400', strokeDashoffset: [400, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
                    />
                  )}

                  <defs>
                    <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3E78B2" stopOpacity="0" />
                      <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                      <stop offset="100%" stopColor="#7FA3C7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Nodes rendering inside Grid */}
                {systemNodes.map((node) => {
                  const isActive = activeSystemNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setActiveSystemNode(node.id)}
                      className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 z-10 ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100 hover:scale-102'
                        }`}
                    >
                      {/* Icon Container */}
                      <div
                        style={{
                          borderColor: isActive ? node.color : 'rgba(255,255,255,0.12)',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : '#141820'
                        }}
                        className="w-10 h-10 rounded-[8px_2px_8px_2px] border flex items-center justify-center text-white mb-2 transition-all duration-200"
                      >
                        {node.icon}
                      </div>

                      <span className="font-mono text-[9px] text-[#F5F5F5] font-semibold">
                        {node.id.toUpperCase()}
                      </span>
                    </div>
                  );
                })}

              </div>

              {/* Dynamic Detail Panel explaining the node role */}
              <div className="mt-5 bg-[#0A0C0F] border border-white/10 rounded-[14px_3px_14px_3px] p-5 text-left min-h-[160px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSystemNode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Node Header */}
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: currentActiveNode.color }}
                          className="w-2 h-2 rounded-[2px]"
                        />
                        <h4 className="font-sans font-bold text-sm text-white">
                          {currentActiveNode.label}
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-muted-text uppercase font-semibold">
                        {currentActiveNode.role}
                      </span>
                    </div>

                    {/* Node Spec bullet list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {currentActiveNode.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-[11px] text-muted-text leading-tight">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Blueprint Legend Footer */}
              <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-muted-text/80">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>Interactive: click nodes to inspect architecture</span>
                </span>
                <span>Active: <strong className="text-white uppercase">{activeSystemNode}</strong></span>
              </div>

            </motion.div>

          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
