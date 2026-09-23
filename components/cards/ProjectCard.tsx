'use client';

import { Project } from '@/types/portfolio';
import { ArrowUpRight, Github, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: (project: Project) => void;
}

export default function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  // Extract last word of title for subtle display styling if needed
  const words = project.title.split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const mainTitle = words.length > 0 ? words.join(' ') : project.title;

  return (
    <motion.div
      id={`project-card-${index}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect?.(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(project);
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative w-full min-h-[380px] sm:min-h-[420px] rounded-[24px_5px_24px_5px] overflow-hidden border border-white/10 hover:border-accent/60 shadow-2xl transition-[border-color,box-shadow] duration-300 cursor-pointer flex flex-col justify-between p-6 sm:p-8 select-none focus:outline-none focus:ring-1 focus:ring-accent"
    >
      {/* Background Image with Smooth Zoom Effect on Hover */}
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-[#12161F]" />
      )}

      {/* Atmospheric Multi-Layer Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F] via-[#0A0C0F]/65 to-[#0A0C0F]/30 pointer-events-none transition-opacity duration-300 group-hover:opacity-95 z-0" />

      {/* Top Bar: Case Study Index & Interactive Plus Action Button */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Index Pill with unique asymmetric corner */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-[8px_2px_8px_2px] bg-[#0E1218]/90 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-widest uppercase text-white/90 font-semibold">
            0{index + 1} {'//'} CASE STUDY
          </span>
        </div>

        {/* Top-Right Quick Links and Action Icon */}
        <div className="flex items-center gap-2">
          {/* Direct GitHub link */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-[8px_2px_8px_2px] bg-[#0E1218]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#1A202A] hover:border-white/30 transition-all duration-200 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto cursor-pointer shadow-md"
              aria-label="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Direct Live Demo link */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-[8px_2px_8px_2px] bg-[#0E1218]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-accent hover:bg-[#1A202A] hover:border-white/30 transition-all duration-200 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto delay-75 cursor-pointer shadow-md"
              aria-label="Live Demo"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Expand Icon */}
          <div className="relative ml-0.5 transition-all duration-200 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto delay-150">
            <div className="w-8 h-8 rounded-[8px_2px_8px_2px] bg-white/15 group-hover:bg-white/25 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-md transition-all duration-200 group-hover:rotate-90">
              <Plus className="w-3.5 h-3.5 text-white stroke-[2]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content: Tags, Monumental Title & Quick Impact */}
      <div className="relative z-10 flex flex-col justify-end mt-auto pt-8">
        {/* Tech Stack Tags Row with unique asymmetric chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-[#0E1218]/90 backdrop-blur-md border border-white/15 hover:border-accent/50 rounded-[6px_2px_6px_2px] text-[10px] font-mono text-white/90 tracking-wide font-medium transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white group-hover:text-accent transition-colors duration-200">
          {mainTitle}
          {lastWord && (
            <span className="ml-1.5 font-light text-[#89AACC]">
              {lastWord}
            </span>
          )}
        </h3>

        {/* Subtitle / Impact Peek */}
        {project.impact && (
          <div className="mt-2.5 flex items-center gap-2 text-xs font-mono text-white/70 overflow-hidden text-ellipsis whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-accent shrink-0" />
            <span className="truncate">{project.impact}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
