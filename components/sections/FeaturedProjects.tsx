'use client';

import AnimatedButton from '@/components/buttons/AnimatedButton';
import ProjectCard from '@/components/cards/ProjectCard';
import ProjectModal from '@/components/modals/ProjectModal';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import { projects } from '@/lib/data';
import { Project } from '@/types/portfolio';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function FeaturedProjects() {
  // Get featured projects
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectedIndex = selectedProject
    ? featured.findIndex((p) => p.slug === selectedProject.slug)
    : 0;

  return (
    <Section id="featured-projects" className="bg-[#0A0C0F] border-b border-white/10 relative py-20">
      <div id="projects" className="absolute top-0 left-0 pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none z-0" />
      <Container className="relative z-10">
        <SectionHeading
          title="Featured Projects"
          subtitle="Selected Works"
          description="A close look at some of the highly modular backend nodes, fluid interactive layouts, and high-performance caching applications I have shipped."
        />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-center">
          <AnimatedButton variant="outline" href="https://github.com/kazi331">
            Explore All Engineering Projects
            <ArrowRight className="w-4 h-4 text-accent" />
          </AnimatedButton>
        </div>

        {/* Detail Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          index={selectedIndex >= 0 ? selectedIndex : 0}
        />
      </Container>
    </Section>
  );
}
