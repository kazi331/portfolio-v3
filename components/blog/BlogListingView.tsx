'use client';

import Footer from '@/components/layout/Footer';
import Container from '@/components/shared/Container';
import { blogPosts } from '@/lib/data';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Calendar,
  Clock,
  Home,
  Layers,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  Tag,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

interface BlogListingViewProps {
  basePath?: string; // '/blog' or '/articles'
}

export default function BlogListingView({ basePath = '/blog' }: BlogListingViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTag = searchParams.get('tag');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved: string[] = [];
      blogPosts.forEach((p) => {
        if (localStorage.getItem(`bookmark-${p.slug}`) === 'true') {
          saved.push(p.slug);
        }
      });
      return saved;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved: string[] = [];
        blogPosts.forEach((p) => {
          if (localStorage.getItem(`bookmark-${p.slug}`) === 'true') {
            saved.push(p.slug);
          }
        });
        setSavedSlugs(saved);
      } catch { }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleBookmark = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isSaved = savedSlugs.includes(slug);
      localStorage.setItem(`bookmark-${slug}`, isSaved ? 'false' : 'true');
      setSavedSlugs((prev) => (isSaved ? prev.filter((s) => s !== slug) : [...prev, slug]));
    } catch { }
  };

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Featured post (always available)
  const featuredPost = useMemo(() => {
    return blogPosts.find((p) => p.featured) || blogPosts[0];
  }, []);

  // Filter posts (category, search, saved, AND tag)
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      if (post.slug === featuredPost?.slug) return false;

      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      const matchesTag =
        !selectedTag ||
        (post.tags &&
          post.tags.some(
            (t) => t.toLowerCase() === selectedTag.toLowerCase()
          ));

      const matchesSaved = !savedOnly || savedSlugs.includes(post.slug);

      return matchesSearch && matchesCategory && matchesTag && matchesSaved;
    });
  }, [searchQuery, selectedCategory, selectedTag, savedOnly, savedSlugs, featuredPost]);

  const totalReadingTime = useMemo(() => {
    return blogPosts.reduce((acc, p) => {
      const mins = parseInt(p.readTime) || 5;
      return acc + mins;
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-primary-text flex flex-col justify-between relative">
      {/* Subtle CAD grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-25 pointer-events-none" />
      {/* Universal Navigation Bar */}

      <main className="flex-1 pt-28 pb-24 relative overflow-hidden">
        {/* Ambient background glows - zero-blur radial gradients */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(78,133,191,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

        <Container className="relative z-10 max-w-6xl">
          {/* Top Breadcrumb & Return to Homepage Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                id="blog-back-to-home"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-white font-mono text-xs transition-all shadow-sm cursor-pointer"
                title="Return to Portfolio Homepage"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-accent group-hover:-translate-x-1 transition-transform" />
                <span>Back to Homepage</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-text">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-accent font-semibold">Engineering Blog</span>
            </div>
          </div>

          {/* Header Block */}
          <div className="max-w-3xl mb-14 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#89AACC] font-bold">
                TECH LOGBOOK & ARCHITECTURE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight leading-[1.05]">
              Engineering <br />
              <span className="font-serif italic font-light text-[#89AACC]">
                Articles & Post-Mortems
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-text font-sans leading-relaxed max-w-2xl pt-2">
              Real-world system breakdowns, WebAssembly edge execution, Next.js optimization guides, and software patterns distilled from production codebases.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5 text-xs font-mono text-muted-text">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                <span>Total Logs: <strong className="text-white">{blogPosts.length}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Combined Read: <strong className="text-white">~{totalReadingTime} mins</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-yellow-500" />
                <span>Topics: <strong className="text-white">{categories.length - 1} domains</strong></span>
              </div>
            </div>
          </div>

          {/* Featured Article Spotlight Card (Always visible regardless of active filters) */}
          {featuredPost && (
            <div className="mb-14">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                    FEATURED ARCHITECTURAL STUDY
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-text hidden sm:inline">
                  Primary Recommended Reading
                </span>
              </div>

              <Link
                href={`${basePath}/${featuredPost.slug}`}
                className="group block relative rounded-[32px] p-7 sm:p-10 bg-gradient-to-br from-[#121212] via-[#161a23] to-[#0c0f14] border border-white/10 hover:border-accent/40 shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Glow gradient highlight on card */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/15 transition-colors" />

                {/* Optional Cover Photo for Featured Blog */}
                {featuredPost.coverImage && (
                  <div className="relative w-full h-52 sm:h-64 lg:h-72 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black/50 shadow-inner">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(max-width: 1200px) 100vw, 1100px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                  </div>
                )}

                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    {featuredPost.category && (
                      <span className="px-3 py-1 rounded-full bg-[#162a45] text-accent border border-accent/30 text-[10px] font-bold uppercase tracking-wider">
                        {featuredPost.category}
                      </span>
                    )}
                    <span className="text-muted-text flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.date}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-muted-text flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white group-hover:text-accent transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm sm:text-base text-muted-text font-sans leading-relaxed line-clamp-3">
                    {featuredPost.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags?.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono text-[#89AACC]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-wider group-hover:bg-white/90 transition-all shadow-lg">
                      <span>Read Deep Dive</span>
                      <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Interactive Search & Controls Bar */}
          <div className="space-y-4 mb-10 pb-6 border-b border-white/5">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Search articles, tags, concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-accent/50 rounded-2xl py-3 pl-11 pr-10 text-sm text-white placeholder:text-muted-text/60 outline-none transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-text hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right Controls: Tag indicator, Bookmarks Filter & View Mode Switcher */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                {/* Active Tag Filter Pill */}
                {selectedTag && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/20 border border-accent/40 text-xs font-mono text-accent">
                    <Tag className="w-3 h-3 text-accent" />
                    <span>Tag: #{selectedTag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(basePath);
                      }}
                      className="p-0.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white cursor-pointer ml-1"
                      title="Clear tag filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Saved Articles Toggle */}
                <button
                  onClick={() => setSavedOnly(!savedOnly)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${savedOnly
                    ? 'bg-accent/20 border-accent text-accent font-bold'
                    : 'bg-white/3 border-white/5 text-muted-text hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-accent' : ''}`} />
                  <span>Saved ({savedSlugs.length})</span>
                </button>

                {/* View mode toggle: Grid vs List */}
                <div className="flex items-center p-1 rounded-xl bg-white/3 border border-white/5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-muted-text hover:text-white'
                      }`}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-muted-text hover:text-white'
                      }`}
                    title="Dense List View"
                    aria-label="Dense List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text/80 font-bold mr-1">
                CATEGORY:
              </span>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-medium tracking-wide transition-all cursor-pointer border ${isSelected
                      ? 'bg-[#162a45] text-accent border-accent/40 shadow-sm'
                      : 'bg-white/3 border-white/5 text-muted-text hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Articles Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-text mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                Showing <strong className="text-white">{filteredPosts.length}</strong> of {blogPosts.length} logs
                {selectedCategory !== 'All' && <span> in <strong className="text-accent">{selectedCategory}</strong></span>}
                {selectedTag && <span> tagged <strong className="text-accent">#{selectedTag}</strong></span>}
                {savedOnly && <span> (Bookmarked)</span>}
              </span>
            </div>
            {(searchQuery || selectedCategory !== 'All' || selectedTag || savedOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSavedOnly(false);
                  router.push(basePath);
                }}
                className="text-accent hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-text mb-2">
                NO MATCHING ARTICLES
              </p>
              <h3 className="text-xl font-bold font-display text-white mb-4">
                Try adjusting your query or filters
              </h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSavedOnly(false);
                  router.push(basePath);
                }}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-accent transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Posts Grid View */}
          {viewMode === 'grid' && filteredPosts.length > 0 && (
            <div className="columns-1 md:columns-2 [column-gap:1.5rem] lg:[column-gap:2rem]">
              {filteredPosts.map((post) => {
                const isSaved = savedSlugs.includes(post.slug);
                return (
                  <Link
                    key={post.slug}
                    href={`${basePath}/${post.slug}`}
                    className="group relative mb-6 lg:mb-8 break-inside-avoid rounded-[28px] bg-[#121212] border border-white/5 hover:border-accent/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    <div>
                      {/* Optional Cover Photo on Card */}
                      {post.coverImage && (
                        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-5 border border-white/5 bg-black/40">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 500px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />
                        </div>
                      )}

                      {/* Top Row: Category, Date, Bookmark button */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          {post.category && (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">
                              {post.category}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-muted-text">
                            {post.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-muted-text uppercase">
                            {post.readTime}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(e, post.slug)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isSaved
                              ? 'bg-accent/20 border-accent/40 text-accent'
                              : 'bg-white/2 border-white/5 text-muted-text hover:text-white hover:bg-white/5'
                              }`}
                            title={isSaved ? 'Remove bookmark' : 'Bookmark article'}
                          >
                            <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-accent' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold font-display text-white group-hover:text-accent transition-colors leading-snug mb-3">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-muted-text font-sans leading-relaxed line-clamp-3 mb-6">
                        {post.description}
                      </p>
                    </div>

                    {/* Bottom Row: Tags & Read CTA */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags?.slice(0, 3).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`${basePath}?tag=${encodeURIComponent(t)}`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${selectedTag?.toLowerCase() === t.toLowerCase()
                              ? 'bg-accent text-black font-bold'
                              : 'bg-white/5 text-[#89AACC] hover:bg-accent/20 hover:text-white'
                              }`}
                            title={`Filter articles by #${t}`}
                          >
                            #{t}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-accent group-hover:translate-x-1 transition-transform uppercase font-bold tracking-wider shrink-0">
                        <span>Read Entry</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Posts Minimal List View */}
          {viewMode === 'list' && filteredPosts.length > 0 && (
            <div className="divide-y divide-white/5 rounded-3xl bg-[#121212]/70 border border-white/5 overflow-hidden">
              {filteredPosts.map((post) => {
                const isSaved = savedSlugs.includes(post.slug);
                return (
                  <Link
                    key={post.slug}
                    href={`${basePath}/${post.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-7 hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-muted-text">
                        <span>{post.date}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-accent uppercase tracking-wider font-semibold">
                          {post.category}
                        </span>
                        <span className="text-white/20">•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-accent transition-colors font-display">
                        {post.title}
                      </h4>

                      <p className="text-xs text-muted-text line-clamp-1 font-sans">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(e, post.slug)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${isSaved
                          ? 'bg-accent/20 border-accent/40 text-accent'
                          : 'bg-white/3 border-white/5 text-muted-text hover:text-white'
                          }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-accent' : ''}`} />
                      </button>

                      <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-accent group-hover:text-black flex items-center justify-center text-muted-text transition-all">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </main>

      {/* Footer for blog listing page */}
      <Footer />
    </div>
  );
}
