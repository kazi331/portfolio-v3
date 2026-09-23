'use client';

import { BlogPost } from '@/types/portfolio';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  featured?: boolean;
}

export default function BlogCard({ post, index, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <motion.div
        id={`blog-card-${index}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`relative overflow-hidden bg-[#11141B] rounded-[22px_5px_22px_5px] border border-white/10 p-6 md:p-8 flex flex-col justify-between group-hover:border-accent/50 transition-[border-color,box-shadow,transform] duration-300 shadow-lg cursor-pointer h-full ${featured ? 'min-h-[320px] md:p-10' : 'min-h-[240px] group-hover:-translate-y-1'}`}
      >
        <div>
          <div className="relative flex items-center justify-between text-[10px] font-mono text-muted-text mb-5">
            <div className="flex items-center gap-2">
              {post.category && (
                <span className="px-2 py-0.5 rounded-[6px_2px_6px_2px] bg-accent/15 border border-accent/30 text-accent font-semibold uppercase tracking-wider text-[8px]">
                  {post.category}
                </span>
              )}
              <span>{post.date}</span>
            </div>
            <span className="px-2 py-0.5 rounded-[6px_2px_6px_2px] bg-[#161B24] border border-white/10 uppercase tracking-widest text-[8px]">
              {post.readTime}
            </span>
          </div>

          {featured && (
            <span className="relative mb-4 inline-flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Editor&apos;s pick
            </span>
          )}
          <h4 className={`relative font-semibold text-primary-text mb-3 group-hover:text-accent transition-colors leading-[1.12] font-display ${featured ? 'text-2xl md:text-3xl max-w-xl' : 'text-lg line-clamp-2'}`}>
            {post.title}
          </h4>
          <p className={`relative text-muted-text text-xs leading-relaxed font-sans ${featured ? 'max-w-xl line-clamp-3 md:text-sm' : 'line-clamp-3'}`}>
            {post.description}
          </p>
          {post.tags && (
            <div className="relative mt-5 flex flex-wrap gap-1.5">
              {post.tags.slice(0, featured ? 3 : 2).map((tag) => (
                <span key={tag} className="rounded-[6px_2px_6px_2px] border border-white/10 bg-[#161B24] px-2 py-0.5 text-[9px] font-mono text-muted-text">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-6">
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
            Read Entry
          </span>
          <ArrowUpRight className="w-4 h-4 text-muted-text group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </motion.div>
    </Link>
  );
}
