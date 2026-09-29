'use client';

import Footer from '@/components/layout/Footer';
import Chip from '@/components/shared/Chip';
import Container from '@/components/shared/Container';
import GithubRepositories from '@/components/shared/GithubRepositories';
import { certifications, educations, personalInfo, skillCategories, workExperiences } from '@/lib/data';
import { ArrowUpRight, Award, CheckCircle2, Download, ExternalLink, Globe2, GraduationCap, Languages, MapPin, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileView() {
    return (
        <div className="min-h-screen bg-[#0A0C0F] text-primary-text">
            <main>
                {/* 1. Hero Section */}
                <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-20 md:pt-44 md:pb-28">
                    {/* CAD architectural grid */}
                    <div className="absolute inset-0 tech-grid opacity-35 pointer-events-none" />

                    <Container className="relative z-10">
                        <div className="grid items-end gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-sm lg:mx-0">
                                <motion.div whileHover={{ y: -6, rotate: -1 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className="group relative">
                                    <div className="absolute -inset-2.5 rounded-[26px_6px_26px_6px] border border-accent/30 rotate-2 transition-all duration-500 group-hover:rotate-3 group-hover:border-accent/60" />
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[22px_5px_22px_5px] border border-white/15 bg-[#11141B] shadow-2xl">
                                        <Image
                                            src={personalInfo.profileImage || 'https://github.com/kazi331.png'}
                                            alt={personalInfo.name}
                                            fill
                                            priority
                                            sizes="(max-width: 1024px) 90vw, 30vw"
                                            className="object-cover object-top grayscale-[15%] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                                        />
                                        <div className="pointer-events-none absolute -inset-y-1/2 -left-1/2 w-1/3 -skew-x-12 bg-white/10 opacity-0 blur-xl transition-all duration-1000 group-hover:left-[125%] group-hover:opacity-100" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0C0F]/90 via-[#0A0C0F]/40 to-transparent p-5 pt-16">
                                            <Chip variant="accent" size="sm">
                                                Available for selected work
                                            </Chip>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="w-5 h-[2px] bg-accent" />
                                    <span className="font-mono text-xs uppercase tracking-[0.24em] text-accent font-semibold">
                                        Profile / 01
                                    </span>
                                </div>
                                <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
                                    Engineering systems that feel <span className="font-serif font-light italic text-accent-secondary">considered.</span>
                                </h1>
                                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-text font-sans">{personalInfo.summary}</p>

                                <div className="mt-8 flex flex-wrap gap-3.5">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] bg-white px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-black transition hover:bg-accent-secondary active:scale-95 shadow-md"
                                    >
                                        <span>Start a conversation</span>
                                        <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                                    </Link>
                                    <a
                                        href={personalInfo.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] border border-white/15 bg-[#141820] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-primary-text transition hover:border-accent hover:text-accent active:scale-95 shadow-sm"
                                    >
                                        <span>GitHub</span>
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                    <a
                                        href="https://resume-generator-d6vd.onrender.com/download"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] border border-accent/40 bg-accent/15 px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-accent-secondary transition hover:border-accent hover:bg-accent/25 active:scale-95 shadow-sm"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span>Download resume</span>
                                    </a>
                                </div>

                                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-widest text-muted-text">
                                    <span className="inline-flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-accent" /> {personalInfo.location}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <Globe2 className="h-3.5 w-3.5 text-accent" /> {personalInfo.website.replace('https://', '')}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </Container>
                </section>

                {/* 2. Capabilities Section */}
                <section className="relative overflow-hidden border-b border-white/10 bg-[#0E1218] py-20 md:py-28">
                    <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

                    <Container className="relative z-10">
                        <div className="mb-12 flex items-end justify-between gap-6">
                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="w-5 h-[2px] bg-accent" />
                                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent font-semibold">Capabilities / 02</p>
                                </div>
                                <h2 className="mt-1 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                                    The working <span className="font-serif font-light italic text-accent-secondary">stack.</span>
                                </h2>
                            </div>
                            <Terminal className="hidden h-10 w-10 text-white/15 sm:block" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {skillCategories.map((category, index) => (
                                <motion.div
                                    key={category.category}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.06 }}
                                    className="rounded-[22px_5px_22px_5px] border border-white/10 bg-[#11141B] p-6 hover:border-accent/40 transition-colors shadow-lg"
                                >
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-primary-text">
                                            {category.category}
                                        </h3>
                                        <Chip variant="accent" size="sm">
                                            0{index + 1}
                                        </Chip>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill) => (
                                            <Chip key={skill.name} variant="neutral">
                                                {skill.name}
                                            </Chip>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* 3. Experience Section */}
                <section className="relative overflow-hidden border-b border-white/10 bg-[#0A0C0F] py-20 md:py-28">
                    <Container className="relative z-10">
                        <div className="grid gap-16 lg:grid-cols-[1.35fr_0.65fr]">
                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="w-5 h-[2px] bg-accent" />
                                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent font-semibold">Experience / 03</p>
                                </div>
                                <h2 className="mt-1 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                                    A record of <span className="font-serif font-light italic text-accent-secondary">shipping.</span>
                                </h2>

                                <div className="mt-10 space-y-6">
                                    {workExperiences.map((experience, index) => (
                                        <motion.article
                                            key={`${experience.company}-${experience.role}`}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.06 }}
                                            className="rounded-[20px_5px_20px_5px] border border-white/10 bg-[#0E1218] p-6 md:p-7 hover:border-accent/40 transition-all shadow-md"
                                        >
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <h3 className="font-display text-xl font-bold text-white">{experience.role}</h3>
                                                <Chip variant="accent" size="sm">
                                                    {experience.period}
                                                </Chip>
                                            </div>
                                            <p className="mt-1 text-sm text-accent-secondary font-mono">
                                                {experience.company} <span className="text-muted-text font-sans">/ {experience.location}</span>
                                            </p>
                                            <ul className="mt-4 space-y-2.5">
                                                {experience.highlights.map((highlight) => (
                                                    <li key={highlight} className="flex gap-2.5 text-sm leading-6 text-muted-text font-sans">
                                                        <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.article>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <div className="mb-5 flex items-center gap-3">
                                        <GraduationCap className="h-4 w-4 text-accent" />
                                        <p className="font-mono text-xs uppercase tracking-widest text-white font-semibold">Education</p>
                                    </div>
                                    <div className="space-y-4">
                                        {educations.map((education) => (
                                            <div key={education.degree} className="rounded-[14px_3px_14px_3px] border border-white/10 bg-[#0E1218] p-5 shadow-sm">
                                                <p className="font-display font-bold text-white text-base">{education.degree}</p>
                                                <p className="mt-1 text-xs text-muted-text font-mono">
                                                    {education.institution} <span className="text-white/30">•</span> {education.period}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-5 flex items-center gap-3">
                                        <Languages className="h-4 w-4 text-accent" />
                                        <p className="font-mono text-xs uppercase tracking-widest text-white font-semibold">Languages</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Chip variant="neutral">
                                            <span>Bengali</span>
                                            <span className="text-accent font-bold">Native</span>
                                        </Chip>
                                        <Chip variant="neutral">
                                            <span>English</span>
                                            <span className="text-accent font-bold">Fluent</span>
                                        </Chip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* 4. Repositories Section */}
                <GithubRepositories profile />

                {/* 5. Credentials Section */}
                <section className="relative overflow-hidden py-20 md:py-28 bg-[#0A0C0F]">
                    <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

                    <Container className="relative z-10">
                        <div className="mb-12 flex items-end justify-between gap-6">
                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="w-5 h-[2px] bg-accent" />
                                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent font-semibold">Credentials / 04</p>
                                </div>
                                <h2 className="mt-1 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                                    Proof of <span className="font-serif font-light italic text-accent-secondary">curiosity.</span>
                                </h2>
                            </div>
                            <Award className="hidden h-10 w-10 text-white/15 sm:block" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {certifications.map((certification, index) => (
                                <a
                                    key={certification.name}
                                    href={certification.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group rounded-[20px_5px_20px_5px] border border-white/10 bg-[#0E1218] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:bg-[#11141B] hover:shadow-xl hover:shadow-black/40"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <Chip variant="accent" size="sm">
                                            0{index + 1} {'//'} {certification.issuer}
                                        </Chip>
                                        <ArrowUpRight className="h-4 w-4 text-muted-text transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                                    </div>
                                    <h3 className="mt-6 font-display text-lg font-bold text-primary-text group-hover:text-accent transition-colors">
                                        {certification.name}
                                    </h3>
                                    <p className="mt-2 text-xs text-muted-text font-mono">
                                        Completed {certification.completedDate}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    );
}
