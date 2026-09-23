'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Skill } from '@/types/portfolio';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export default function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <motion.div
      id={`skill-card-${index}`}
      whileHover={{ y: -3, borderColor: 'rgba(62, 120, 178, 0.5)' }}
      className="p-5 rounded-[14px_3px_14px_3px] bg-[#11141B] border border-white/10 flex flex-col justify-between transition-all duration-200 group shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-primary-text group-hover:text-accent transition-colors font-sans">
            {skill.name}
          </h4>
          <span className="text-[10px] font-mono text-muted-text mt-1 block">
            Competency: {skill.level}%
          </span>
        </div>
        <span className="p-1 rounded-[6px_2px_6px_2px] bg-[#161B24] border border-white/10 text-muted-text group-hover:text-accent group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="w-full h-1 bg-white/5 rounded-sm overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
          className="h-full bg-accent"
        />
      </div>
    </motion.div>
  );
}
