'use client';

import { triggerRouteTransition } from '@/components/layout/PageLoader';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Home', id: 'hero', path: '/' },
  { label: 'Projects', id: 'featured-projects', path: '/#featured-projects' },
  { label: 'Stack', id: 'tech-stack', path: '/#tech-stack' },
  { label: 'Journey', id: 'experience', path: '/#experience' },
  { label: 'Services', id: 'services', path: '/#services' },
  { label: 'Blog', id: 'recent-blog', path: '/blog' },
  { label: 'Profile', id: 'profile', path: '/profile' },
  // { label: 'Contact', id: 'contact', path: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isBlogPage = pathname.startsWith('/blog') || pathname.startsWith('/articles');
  const isStandalonePage = pathname === '/profile' || pathname === '/contact';

  const [active, setActive] = useState(() => (isBlogPage ? 'recent-blog' : 'hero'));
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll position to switch between full-width top state and floating pill dock
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple scroll spy to update active item on home page
  useEffect(() => {
    if (isBlogPage || isStandalonePage) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActive(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPage, isStandalonePage]);

  // Close mobile dropdown when tapping outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#navbar')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const scrollToTarget = (targetId: string) => {
    if (targetId === 'hero') {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number | HTMLElement, opts?: object) => void } }).__lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { duration: 1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetEl =
      document.getElementById(targetId) ||
      (targetId === 'featured-projects' ? document.getElementById('projects') : null) ||
      (targetId === 'projects' ? document.getElementById('featured-projects') : null) ||
      (targetId === 'tech-stack' ? document.getElementById('stack') : null) ||
      (targetId === 'stack' ? document.getElementById('tech-stack') : null) ||
      (targetId === 'recent-blog' ? document.getElementById('blog') : null);

    if (!targetEl) return;

    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number | HTMLElement, opts?: object) => void } }).__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetEl, { offset: -90, duration: 1 });
    } else {
      const navOffset = 90;
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - navOffset);
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollTo = (item: (typeof navItems)[number]) => {
    setIsOpen(false);

    if (item.path === '/blog') {
      if (!isBlogPage) {
        triggerRouteTransition('/blog');
        router.push('/blog');
      } else {
        scrollToTarget('hero');
      }
      return;
    }

    if (item.path === '/profile' || item.path === '/contact') {
      triggerRouteTransition(item.path);
      router.push(item.path);
      return;
    }

    if (isStandalonePage) {
      triggerRouteTransition(item.path || '/');
      router.push(item.path || `/#${item.id}`);
      return;
    }

    if (isBlogPage) {
      triggerRouteTransition(item.path || '/');
      router.push(item.path || `/#${item.id}`);
      return;
    }

    // Small timeout allows the mobile menu collapse to start without interfering with smooth scroll
    setTimeout(() => {
      scrollToTarget(item.id);
    }, 20);
  };

  return (
    <nav
      id="navbar"
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        isScrolled
          ? 'top-4 sm:top-5 w-[92%] max-w-3xl rounded-[18px_4px_18px_4px] border border-white/10 glass-nav shadow-2xl'
          : 'top-0 w-full max-w-full rounded-none border-b border-white/10 border-t-0 border-x-0 bg-[#0A0C0F]/90 backdrop-blur-md shadow-none'
      }`}
    >
      {/* Top Header Bar */}
      <div
        className={`w-full flex items-center justify-between transition-all duration-500 ${
          isScrolled
            ? 'px-5 py-3 gap-4 sm:gap-8'
            : 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3.5 sm:py-4 gap-4'
        }`}
      >
        {/* Left Brand Logo */}
        <div
          id="navbar-logo"
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => {
            if (pathname !== '/') {
              triggerRouteTransition('/');
              router.push('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-2.5 h-2.5 bg-accent rounded-[3px_1px_3px_1px]" />
          <span className="font-mono font-bold tracking-tight text-xs sm:text-sm text-primary-text">KS.01</span>
        </div>

        <div className={`h-4 w-[1px] bg-white/10 ${isScrolled ? 'hidden lg:block' : 'hidden'}`} />

        {/* Desktop Menu */}
        <ul
          id="navbar-menu"
          className={`hidden sm:flex items-center font-mono font-semibold tracking-widest uppercase opacity-85 transition-all duration-300 ${
            isScrolled ? 'gap-5 text-[10px]' : 'gap-6 lg:gap-8 text-[10px] sm:text-[11px]'
          }`}
        >
          {navItems.map((item) => {
            const isSelected = active === item.id;
            return (
              <li
                key={item.id}
                onClick={() => handleScrollTo(item)}
                className={`cursor-pointer transition-colors duration-200 ${
                  isSelected ? 'text-accent' : 'text-muted-text hover:text-primary-text'
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
              className={`pb-5 pt-3.5 flex flex-col gap-1.5 ${
                isScrolled ? 'px-5' : 'max-w-7xl mx-auto px-6 sm:px-8'
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
                    onClick={() => handleScrollTo(item)}
                    className={`w-full text-left font-mono font-semibold uppercase tracking-wider text-xs py-2.5 px-3.5 rounded-[8px_2px_8px_2px] transition-all ${
                      isSelected
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
