export const THEME_STORAGE_KEY = 'theme';

/** Runs before paint so the first frame matches the system scheme or a saved choice. */
export const themeBootScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;}catch(e){}})();`;
