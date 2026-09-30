'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#090909] text-white flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 rounded-xl border border-white/10 bg-[#12161E] p-8">
          <h2 className="text-xl font-bold font-sans">Something went wrong</h2>
          <p className="text-xs text-zinc-400 font-mono">
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-mono font-bold text-black hover:bg-zinc-200 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
