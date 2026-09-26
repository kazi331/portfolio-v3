'use client';

import { triggerRouteTransition } from '@/components/layout/PageLoader';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';

type NavItem = {
  label: string;
  id: string;
  path: string;
  type: 'section' | 'page';
};

const navItems: NavItem[] = [
  { label: 'Home', id: 'hero', path: '/', type: 'section' },
  { label: 'Projects', id: 'featured-projects', path: '/#featured-projects', type: 'section' },
  { label: 'Stack', id: 'tech-stack', path: '/#tech-stack', type: 'section' },
  { label: 'Journey', id: 'experience', path: '/#experience', type: 'section' },
  { label: 'Services', id: 'services', path: '/#services', type: 'section' },
  { label: 'Blog', id: 'blog', path: '/blog', type: 'page' },
  { label: 'Profile', id: 'profile', path: '/profile', type: 'page' },
];

const sectionItems = navItems.filter((item) => item.type === 'section');

function activePageId(pathname: string) {
  return (
    navItems.find(
      (item) =>
        item.type === 'page' &&
        (pathname === item.path || pathname.startsWith(`${item.path}/`))
    )?.id ?? null
  );
}

function sectionIdFromHash() {
  const id = window.location.hash.slice(1);
  return sectionItems.some((item) => item.id === id) ? id : null;
}

type LenisScroll = {
  scrollTo: (target: number | HTMLElement, opts?: object) => void;
};

function getLenis() {
  const lenis = (window as unknown as { __lenis?: LenisScroll | null }).__lenis;
  return lenis && typeof lenis.scrollTo === 'function' ? lenis : null;
}

function scrollToTarget(targetId: string) {
  const lenis = getLenis();

  if (targetId === 'hero') {
    if (lenis) lenis.scrollTo(0, { duration: 1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  if (lenis) {
    lenis.scrollTo(targetEl, { offset: -90, duration: 1 });
    return;
  }

  const top = Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - 90);
  window.scrollTo({ top, behavior: 'smooth' });
}

function activeSectionId() {
  const scrollPos = window.scrollY + 180;

  for (const item of sectionItems) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
      return item.id;
    }
  }

  return 'hero';
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  const [active, setActive] = useState<string | null>(() =>
    isHome ? 'hero' : activePageId(pathname)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useLayoutEffect(() => {
    if (!isHome) {
      setActive(activePageId(pathname));
      return;
    }

    setActive(sectionIdFromHash() ?? 'hero');
  }, [isHome, pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const update = () => setActive(activeSectionId());
    if (!sectionIdFromHash()) update();

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const id = sectionIdFromHash();
    if (!id) return;

    const timer = window.setTimeout(() => scrollToTarget(id), 60);
    return () => window.clearTimeout(timer);
  }, [isHome]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#navbar')) setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const navigate = (path: string) => {
    triggerRouteTransition(path);
    router.push(path);
  };

  const handleNav = (item: NavItem) => {
    setIsOpen(false);

    if (item.type === 'page') {
      if (pathname === item.path) {
        scrollToTarget('hero');
        return;
      }
      navigate(item.path);
      return;
    }

    if (!isHome) {
      navigate(item.path);
      return;
    }

    window.setTimeout(() => scrollToTarget(item.id), 20);
  };

  return (
    <nav
      id="navbar"
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isScrolled
        ? 'top-4 sm:top-5 w-[92%] max-w-3xl rounded-[18px_4px_18px_4px] border border-white/10 glass-nav shadow-2xl'
        : 'top-0 w-full max-w-full rounded-none border-b border-white/10 border-t-0 border-x-0 bg-[#0A0C0F]/90 backdrop-blur-md shadow-none'
        }`}
    >
      {/* Top Header Bar */}
      <div
        className={`w-full flex items-center justify-between transition-all duration-500 ${isScrolled
          ? 'px-5 py-3 gap-4 sm:gap-8'
          : 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3.5 sm:py-4 gap-4'
          }`}
      >
        {/* Left Brand Logo */}
        <div
          id="navbar-logo"
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => {
            setIsOpen(false);
            if (pathname !== '/') {
              navigate('/');
              return;
            }
            scrollToTarget('hero');
          }}
        >
          <div className="w-2.5 h-2.5 bg-accent rounded-[3px_1px_3px_1px]" />
          <span className="font-mono font-bold tracking-tight text-xs sm:text-sm text-primary-text">KS.01</span>
        </div>

        <div className={`h-4 w-[1px] bg-white/10 ${isScrolled ? 'hidden lg:block' : 'hidden'}`} />

        {/* Desktop Menu */}
        <ul
          id="navbar-menu"
          className={`hidden sm:flex items-center font-mono font-semibold tracking-widest uppercase opacity-85 transition-all duration-300 ${isScrolled ? 'gap-5 text-[10px]' : 'gap-6 lg:gap-8 text-[10px] sm:text-[11px]'
            }`}
        >
          {navItems.map((item) => {
            const isSelected = active === item.id;
            return (
              <li
                key={item.id}
                onClick={() => handleNav(item)}
                className={`cursor-pointer transition-colors duration-200 ${isSelected ? 'text-accent' : 'text-muted-text hover:text-primary-text'
                  }`}
              >
                {item.label}
              </li>
            );
          })}
        </ul>

        <div className={`h-4 w-[1px] bg-white/10 ${isScrolled ? 'hidden lg:block' : 'hidden'}`} />

        {/* Right Buttons Container */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/contact"
            id="navbar-resume-btn"
            onClick={() => setIsOpen(false)}
            className="text-[10px] font-mono font-semibold bg-[#F1F3F5] text-[#0A0C0F] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[8px_2px_8px_2px] uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-sm active:translate-y-[1px]"
          >
            Contact
          </Link>

          {/* Hamburger Icon on mobile view */}
          <button
            id="navbar-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-primary-text p-1.5 rounded-[6px_2px_6px_2px] hover:bg-white/5 transition-all cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Attached Mobile Slide-Down Menu Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="navbar-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden overflow-hidden border-t border-white/10 bg-[#101318]/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pb-5 pt-3.5 flex flex-col gap-1.5 ${isScrolled ? 'px-5' : 'max-w-7xl mx-auto px-6 sm:px-8'
                }`}
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-text border-b border-white/5 pb-2 mb-1">
                Navigation Menu
              </div>
              {navItems.map((item) => {
                const isSelected = active === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    type="button"
                    onClick={() => handleNav(item)}
                    className={`w-full text-left font-mono font-semibold uppercase tracking-wider text-xs py-2.5 px-3.5 rounded-[8px_2px_8px_2px] transition-all ${isSelected
                      ? 'text-accent bg-accent/10 border-l-2 border-accent'
                      : 'text-muted-text hover:text-primary-text hover:bg-white/5'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
