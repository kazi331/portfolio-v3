'use client';

import React from 'react';
import { motion } from 'motion/react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 pb-2 overflow-x-auto scrollbar-none max-w-full">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-colors duration-300 relative whitespace-nowrap cursor-pointer ${
              isSelected ? '!text-white' : 'text-muted-text hover:text-primary-text bg-white/3 hover:bg-white/5 border border-white/3'
            }`}
          >
            <span className="relative z-10">{category}</span>
            {isSelected && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-accent rounded-full border border-accent/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
