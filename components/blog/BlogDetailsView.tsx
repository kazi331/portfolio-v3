'use client';

import Footer from '@/components/layout/Footer';
import Container from '@/components/shared/Container';
import { blogPosts, personalInfo } from '@/lib/data';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Flame,
  Github,
  Home,
  Link2,
  Linkedin,
  Mail,
  Share2,
  Sparkles,
  ThumbsUp,
  Twitter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import ReadingProgressBar from './ReadingProgressBar';
import TableOfContents from './TableOfContents';

interface BlogDetailsViewProps {
  slug: string;
  basePath?: string; // '/blog' or '/articles'
}

export default function BlogDetailsView({ slug, basePath = '/blog' }: BlogDetailsViewProps) {
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = postIndex >= 0 ? blogPosts[postIndex] : null;

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window === 'undefined' || !post) return false;
    try {
      return localStorage.getItem(`bookmark-${post.slug}`) === 'true';
    } catch {
      return false;
    }
  });
  const [reaction, setReaction] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  const toggleBookmark = () => {
    if (!post) return;
    const nextVal = !bookmarked;
    setBookmarked(nextVal);
    try {
      localStorage.setItem(`bookmark-${post.slug}`, nextVal ? 'true' : 'false');
      // Dispatch custom event for listing page sync
      window.dispatchEvent(new Event('storage'));
    } catch { }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url,
        });
        return;
      } catch { }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { }
  };

  if (!post) {
    return (
      <main className="bg-[#090909] text-[#F5F5F5] min-h-screen py-24 flex items-center justify-center">
        <Container className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-text mb-4">
            ARTICLE NOT FOUND
          </p>
          <h1 className="text-3xl font-display font-bold mb-6">Looking for an engineering log?</h1>
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-accent font-mono text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Engineering Logs
          </Link>
        </Container>
      </main>
    );
  }

  // Word count & approximate stats
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-[#090909] min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Portfolio Navbar */}

      <main className="bg-[#090909] text-[#F5F5F5] pt-28 pb-20 relative selection:bg-accent/30 selection:text-white flex-1">
        {/* Top Reading Progress Bar */}
        <ReadingProgressBar />

        {/* Atmospheric Ambient Glows - zero-blur radial gradients */}
        {/* <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(78,133,191,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" /> */}

        <Container className="relative z-10 max-w-6xl">
          {/* Top Navigation & Breadcrumbs (Back to Home / Blog) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 text-muted-text hover:text-white transition-colors"
                title="Return to Home Portfolio"
              >
                <Home className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
                <span>Home</span>
              </Link>
              <span className="text-white/20">/</span>
              <Link
                href={basePath}
                className="text-muted-text hover:text-accent transition-colors"
                title="Return to Blog List"
              >
                Engineering Logs
              </Link>
              <span className="text-white/20 hidden sm:inline">/</span>
              <span className="text-white/60 truncate max-w-[220px] sm:max-w-[340px] hidden sm:inline">
                {post.title}
              </span>
            </div>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-2">
              {/* Back to all posts */}
              <Link
                href={basePath}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 border border-white/5 text-[11px] font-mono text-muted-text hover:text-white hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-accent" />
                <span>All Logs</span>
              </Link>

              {/* Font Size Toggle */}
              <button
                onClick={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono transition-all cursor-pointer border ${textSize === 'large'
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-white/3 border-white/5 text-muted-text hover:text-white'
                  }`}
                title="Toggle reading text size"
              >
                Aa {textSize === 'large' ? '+2' : ''}
              </button>

              {/* Bookmark button */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full border transition-all cursor-pointer ${bookmarked
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-white/3 border-white/5 text-muted-text hover:text-white hover:bg-white/5'
                  }`}
                title={bookmarked ? 'Saved to bookmarks' : 'Save article'}
                aria-label="Bookmark article"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-accent' : ''}`} />
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono transition-all cursor-pointer border ${copied
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/3 border-white/5 text-muted-text hover:text-white hover:bg-white/5'
                  }`}
                title="Share article"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Article Hero Banner */}
          <div className=" mx-auto mb-12 space-y-6">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              {post.category && (
                <span className="px-3.5 py-1 rounded-full bg-[#162a45] text-accent border border-accent/30 text-[10px] uppercase font-bold tracking-wider">
                  {post.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-muted-text">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-muted-text">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-muted-text">
                <BookOpen className="w-3.5 h-3.5" />
                {wordCount} words
              </span>
            </div>

            {/* Article Monumental Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#F5F5F5] tracking-tight leading-[1.12]">
              {post.title}
            </h1>

            {/* Description Lead */}
            <p className="text-base sm:text-lg text-muted-text font-sans leading-relaxed">
              {post.description}
            </p>

            {/* Clickable Tags in Hero */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-mono text-muted-text uppercase tracking-wider font-semibold mr-1">
                  Topics:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-[11px] font-mono text-[#89AACC] hover:text-white transition-all cursor-pointer shadow-sm group"
                    title={`Filter articles by tag: #${tag}`}
                  >
                    <span className="text-accent/70 group-hover:text-accent font-bold">#</span>
                    <span>{tag}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Author Block */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4E85BF] to-[#10B981] flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
                KS
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-display">
                  {personalInfo.name}
                </h4>
                <p className="text-xs text-muted-text font-mono">
                  {personalInfo.title} • Technical Case Study
                </p>
              </div>
            </div>

            {/* Optional Cover Photo System */}
            {post.coverImage && (
              <div className="relative w-full h-[240px] sm:h-[380px] md:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl mt-8 bg-black/40 group">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1000px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                {post.category && (
                  <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-7 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-widest text-white/90 font-semibold shadow-lg">
                      {post.category} Overview
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Two-Column Grid: Article Content (8 cols) + Sticky Sidebar (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Main Article Body (8 cols) */}
            <div className={`lg:col-span-8 bg-[#0f0f0f]/60 border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm ${textSize === 'large' ? 'text-lg' : 'text-base'
              }`}>
              {/* Rendered Markdown with Developer Code Blocks */}
              <MarkdownRenderer content={post.content || ''} />

              {/* Tags footer */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-text mr-2 uppercase tracking-wider font-bold">
                    TAGS:
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-[11px] font-mono text-[#89AACC] hover:text-white transition-all cursor-pointer shadow-sm group"
                      title={`Filter articles by tag: #${tag}`}
                    >
                      <span className="text-accent/70 group-hover:text-accent font-bold">#</span>
                      <span>{tag}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* "Was this helpful?" Reaction feedback */}
              <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Did you find this article useful?
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Insightful', icon: <ThumbsUp className="w-3.5 h-3.5" /> },
                    { label: 'Practical', icon: <Code2 className="w-3.5 h-3.5" /> },
                    { label: 'Must-Save', icon: <Flame className="w-3.5 h-3.5" /> },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setReaction(item.label)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${reaction === item.label
                        ? 'bg-accent/20 border-accent text-accent font-bold'
                        : 'bg-white/3 border-white/5 text-muted-text hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next / Previous Article Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-white/5">
                {prevPost ? (
                  <Link
                    href={`${basePath}/${prevPost.slug}`}
                    className="group p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-muted-text group-hover:text-accent mb-1">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous Log
                    </div>
                    <h5 className="text-xs font-semibold text-white group-hover:text-accent transition-colors line-clamp-1 font-display">
                      {prevPost.title}
                    </h5>
                  </Link>
                ) : <div />}

                {nextPost && (
                  <Link
                    href={`${basePath}/${nextPost.slug}`}
                    className="group p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all block text-right sm:text-right"
                  >
                    <div className="flex items-center justify-end gap-1 text-[10px] font-mono uppercase tracking-widest text-muted-text group-hover:text-accent mb-1">
                      Next Log <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <h5 className="text-xs font-semibold text-white group-hover:text-accent transition-colors line-clamp-1 font-display">
                      {nextPost.title}
                    </h5>
                  </Link>
                )}
              </div>
            </div>

            {/* Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Table of Contents */}
              <TableOfContents content={post.content || ''} />

              {/* Article Quick Specs */}
              <div className="bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text font-bold block pb-2 border-b border-white/5">
                  Technical Specifications
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center text-muted-text">
                    <span>Domain:</span>
                    <span className="text-[#F5F5F5] font-semibold">{post.category || 'Engineering'}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-text">
                    <span>Audience:</span>
                    <span className="text-[#89AACC]">Mid / Senior Engineers</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-text">
                    <span>Read Cadence:</span>
                    <span className="text-[#F5F5F5]">{post.readTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-text">
                    <span>License:</span>
                    <span className="text-white/60">MIT / Open Knowledge</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <span className="text-muted-text text-[10px] uppercase tracking-wider font-semibold block">
                        Indexed Topics:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((t) => (
                          <Link
                            key={t}
                            href={`${basePath}?tag=${encodeURIComponent(t)}`}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-accent/20 border border-white/5 hover:border-accent/30 text-[10px] font-mono text-[#89AACC] hover:text-white transition-all cursor-pointer"
                            title={`Filter by tag #${t}`}
                          >
                            #{t}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text font-bold block pb-2 border-b border-white/5">
                  Written By
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent font-mono">
                    KS
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white font-display">
                      {personalInfo.name}
                    </h4>
                    <p className="text-[11px] text-muted-text">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-text leading-relaxed font-sans">
                  Passionate about high-performance React architectures, WebAssembly on the edge, and zero-downtime distributed deployments.
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <a
                    href="https://github.com/kazi331"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono flex items-center justify-center gap-1.5 transition-all text-white"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={`mailto:${personalInfo.email}?subject=Feedback on article: ${post.title}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono flex items-center justify-center gap-1.5 transition-all text-white"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Discuss</span>
                  </a>
                </div>
              </div>

              {/* Social Share Card */}
              <div className="bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text font-bold block pb-2 border-b border-white/5">
                  Share Article
                </span>
                <p className="text-xs text-muted-text leading-relaxed">
                  Share this breakdown with your engineering team or community:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.title} by @kazi331`)}&url=${encodeURIComponent(`https://kazisharif.dev/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/40 border border-white/5 text-xs font-mono flex items-center justify-center gap-1.5 transition-all text-white hover:text-[#1DA1F2]"
                    title="Share on X / Twitter"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>X / Twitter</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://kazisharif.dev/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/40 border border-white/5 text-xs font-mono flex items-center justify-center gap-1.5 transition-all text-white hover:text-[#0A66C2]"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
                <button
                  onClick={handleShare}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-accent/20 hover:border-accent/40 border border-white/5 text-xs font-mono flex items-center justify-center gap-1.5 transition-all text-white cursor-pointer mt-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5 text-accent" />
                      <span>Copy Direct Link</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block mb-1">
                    Further Reading
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Related Technical Logs
                  </h3>
                </div>
                <Link
                  href={basePath}
                  className="hidden sm:inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-text hover:text-accent transition-colors"
                >
                  Browse All <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((related, idx) => (
                  <Link
                    key={related.slug}
                    href={`${basePath}/${related.slug}`}
                    className="group p-6 sm:p-7 rounded-3xl bg-[#121212]/80 border border-white/5 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-text mb-3">
                        <span>{related.date}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px]">
                          {related.readTime}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold font-display text-white group-hover:text-accent transition-colors mb-2 line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted-text line-clamp-2 leading-relaxed font-sans">
                        {related.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-accent pt-4 mt-4 border-t border-white/5 uppercase tracking-wider font-bold">
                      <span>Read Case Study</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </Container>
      </main>

      {/* Footer for single blog page */}
      <Footer />
    </div>
  );
}
