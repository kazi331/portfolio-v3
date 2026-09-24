'use client';

import { THEME_STORAGE_KEY } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem(THEME_STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color scheme"
      title="Toggle color scheme"
      className="theme-toggle ml-2 inline-flex h-4 w-4 shrink-0 items-center justify-center align-middle text-muted-text transition-colors hover:text-accent cursor-pointer"
    >
      <Sun className="theme-icon-sun h-3 w-3" strokeWidth={2} />
      <Moon className="theme-icon-moon h-3 w-3" strokeWidth={2} />
    </button>
  );
}
