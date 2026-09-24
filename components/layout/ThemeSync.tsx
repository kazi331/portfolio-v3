'use client';

import { THEME_STORAGE_KEY } from '@/lib/theme';
import { useEffect } from 'react';

/** Keeps an unset preference in step with the OS color scheme. */
export default function ThemeSync() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');

    const applySystem = () => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return;

      const next = media.matches ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    };

    media.addEventListener('change', applySystem);
    return () => media.removeEventListener('change', applySystem);
  }, []);

  return null;
}
