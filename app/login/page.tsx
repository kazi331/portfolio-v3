'use client';

import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const fieldClassName =
  'w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 autofill:shadow-[inset_0_0_0_1000px_#101318] autofill:[-webkit-text-fill-color:#F1F3F5]';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-primary-text">
      <div className="tech-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-secondary/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-16">
        <div className="radius-card w-full border border-white/10 bg-surface-raised p-8 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.85)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-secondary">
            Admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary-text">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            Use your admin email and password to open the dashboard.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-[10px_2px_10px_2px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-text"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com"
                className={`mt-2 ${fieldClassName}`}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-text"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Your password"
                  className={`${fieldClassName} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text transition hover:text-primary-text disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[12px_3px_12px_3px] bg-[#F1F3F5] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A0C0F] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Signing in' : 'Sign in'}
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 inline-flex font-mono text-[10px] uppercase tracking-widest text-muted-text transition hover:text-primary-text"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
