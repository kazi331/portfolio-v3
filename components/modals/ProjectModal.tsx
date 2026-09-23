'use client';

import Chip from '@/components/shared/Chip';
import { Project } from '@/types/portfolio';
import { CheckCircle2, ExternalLink, Github, Layers, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect } from 'react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  index?: number;
}

export default function ProjectModal({ project, isOpen, onClose, index = 0 }: ProjectModalProps) {
  // Prevent background scroll when open & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Rigorously block background scrolling on both body and html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Prevent touch scrolling on backdrop on mobile/tablet
    const preventBackdropScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('#project-modal-dialog')) {
        return; // Allow scrolling inside the modal dialog
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', preventBackdropScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', preventBackdropScroll);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="project-modal-backdrop"
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            id="project-modal-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#0E1218] border border-white/15 rounded-[26px_6px_26px_6px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Scrollable Content wrapper */}
            <div className="overflow-y-auto scrollbar-none p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">

                {/* Left Column: Featured Project Image */}
                <div className="lg:col-span-5 relative w-full h-[280px] sm:h-[360px] lg:h-[520px] rounded-[20px_4px_20px_4px] overflow-hidden border border-white/12 shadow-xl bg-[#11141B]">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      priority
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#11141B] to-[#1a2332] flex items-center justify-center">
                      <Layers className="w-12 h-12 text-white/30" />
                    </div>
                  )}

                  {/* Gradient bottom overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1218] via-transparent to-transparent pointer-events-none" />

                  {/* Category Chip on Image */}
                  {project.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <Chip variant="neutral" className="bg-[#0E1218]/90 backdrop-blur-md border-white/20 text-white/90">
                        {project.category}
                      </Chip>
                    </div>
                  )}

                  {/* Case study indicator */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <Chip variant="accent" size="sm" className="bg-[#0E1218]/90 backdrop-blur-md">
                      CASE STUDY 0{index + 1}
                    </Chip>
                  </div>
                </div>

                {/* Right Column: Project Details */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                  {/* Top Bar: Tags & Close Button */}
                  <div className="flex items-start justify-between gap-4">
                    {/* Standardized Tags List */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.tags.map((tag) => (
                        <Chip key={tag} variant="neutral">
                          {tag}
                        </Chip>
                      ))}
                    </div>

                    {/* Architectural Close Button */}
                    <button
                      id="close-project-modal-btn"
                      onClick={onClose}
                      className="shrink-0 w-9 h-9 rounded-[8px_2px_8px_2px] bg-[#141820] hover:bg-[#1C222C] border border-white/12 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 active:scale-95"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Overview */}
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-text font-sans leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Challenge & Solution Grid/Sections */}
                  {(project.challenge || project.solution) && (
                    <div className="space-y-4 pt-1">
                      {project.challenge && (
                        <div>
                          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent font-semibold block mb-1.5">
                            THE CHALLENGE
                          </span>
                          <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed font-sans">
                            {project.challenge}
                          </p>
                        </div>
                      )}

                      {project.solution && (
                        <div>
                          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent font-semibold block mb-1.5">
                            THE SOLUTION
                          </span>
                          <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed font-sans">
                            {project.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Impact Card */}
                  {project.impact && (
                    <div className="p-5 rounded-[18px_4px_18px_4px] bg-[#11141B] border border-white/12 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] sm:text-[11px] font-mono text-accent font-bold uppercase tracking-wider">
                          KEY IMPACT
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                          {project.impact}
                        </p>
                      </div>

                      {/* Standardized metric chips */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3.5 pt-3.5 border-t border-white/10">
                          {project.metrics.map((metric) => (
                            <Chip key={metric.label} variant="neutral">
                              <span className="text-muted-text font-normal">{metric.label}:</span>
                              <span className="text-accent font-bold">{metric.value}</span>
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons: Live Demo & Source Code */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    {project.liveUrl && (
                      <motion.a
                        id="modal-live-demo-link"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-[12px_3px_12px_3px] bg-white hover:bg-accent-secondary text-black font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      </motion.a>
                    )}

                    {project.githubUrl && (
                      <motion.a
                        id="modal-github-source-link"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-[12px_3px_12px_3px] bg-[#141820] hover:bg-[#1C222C] border border-white/15 text-white hover:border-accent hover:text-accent font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source</span>
                      </motion.a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
