'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only enable Lenis smooth scrolling on devices with fine pointer (mouse/trackpad).
    // On mobile touch devices, native momentum scrolling is 120Hz/60Hz hardware accelerated
    // and bypassing Lenis prevents touch scroll contention and saves battery/GPU.
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis | null }).__lenis = null;
    };
  }, []);

  // When pathname changes, reset scroll position and recalculate layout dimensions.
  // Hash targets are left in place so section links can scroll to the section.
  useEffect(() => {
    const hasSectionHash = window.location.hash.length > 1;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void; resize: () => void } }).__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      if (!hasSectionHash) lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        lenis.resize();
      }, 50);
    } else if (!hasSectionHash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
