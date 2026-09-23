'use client';

import AnimatedButton from '@/components/buttons/AnimatedButton';
import BlogCard from '@/components/cards/BlogCard';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import { blogPosts } from '@/lib/data';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function RecentBlog() {
  const recent = blogPosts.slice(0, 2);
  const [featured, supporting] = recent;

  return (
    <Section id="recent-blog" className="bg-[#0A0C0F] border-b border-white/10 relative py-20">
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none z-0" />
      <Container className="relative z-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <SectionHeading
            title="Recent Engineering Articles"
            subtitle="Tech Logbook"
            description="A collection of structured post-mortems, software design patterns, and in-depth framework studies."
            className="mb-0"
          />
          <div className="flex shrink-0 items-center gap-3 border-l border-accent/40 pl-4 font-mono text-[10px] uppercase tracking-widest text-muted-text"><BookOpen className="h-4 w-4 text-accent" /><span>{blogPosts.length.toString().padStart(2, '0')} field notes<br /><span className="text-white/30">and counting</span></span></div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.25fr_0.75fr] lg:gap-6 mb-12 max-w-5xl mx-auto">
          {featured && <BlogCard post={featured} index={0} featured />}
          {supporting && <BlogCard post={supporting} index={1} />}
        </div>

        {/* View all button */}
        <div className="flex flex-col items-center justify-center gap-4">
          <AnimatedButton variant="outline" href="/blog">
            View All Engineering Logs
            <ArrowRight className="w-4 h-4 text-accent" />
          </AnimatedButton>
          <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-text"><Sparkles className="h-3 w-3 text-accent-secondary" /> New perspectives, periodically</span>
        </div>
      </Container>
    </Section>
  );
}
