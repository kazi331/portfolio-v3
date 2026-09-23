'use client';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Chip from '@/components/shared/Chip';
import Container from '@/components/shared/Container';
import { personalInfo } from '@/lib/data';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Send
} from 'lucide-react';
import React, { FormEvent, useState } from 'react';

export default function ContactView() {
  const [revealedContact, setRevealedContact] = useState<'email' | 'phone' | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [isCredentialsMissing, setIsCredentialsMissing] = useState(false);
  const [isHtmlError, setIsHtmlError] = useState(false);

  const revealContact = (contact: 'email' | 'phone') => {
    setRevealedContact(contact);
  };

  const handleContactKeyDown = (
    event: React.KeyboardEvent<HTMLSpanElement>,
    contact: 'email' | 'phone'
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      revealContact(contact);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (status === 'success') {
      setStatus('idle');
      setFeedback('');
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');
    setIsCredentialsMissing(false);
    setIsHtmlError(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(formData),
      });

      // Safely inspect content type and read body as text to prevent "Unexpected token '<'" JSON parse crashes
      const contentType = res.headers.get('content-type') || '';
      const rawText = await res.text();
      const trimmedText = (rawText || '').trim();

      // Check if server or gateway returned an HTML document (e.g. 502/504 Bad Gateway, 500 HTML error page, 404)
      const isHtmlResponse =
        trimmedText.startsWith('<') ||
        trimmedText.includes('<html') ||
        trimmedText.includes('<!DOCTYPE') ||
        trimmedText.includes('<body') ||
        contentType.includes('text/html');

      if (isHtmlResponse) {
        setIsHtmlError(true);
        setStatus('error');

        if (res.status === 503) {
          setIsCredentialsMissing(true);
          setFeedback('Email service credentials are not configured in environment variables.');
        } else if (res.status === 404) {
          setFeedback('The email endpoint (/api/contact) was not found (HTTP 404).');
        } else if (res.status === 502 || res.status === 504) {
          setFeedback(`Mail gateway or proxy timeout (HTTP ${res.status}). The service is temporarily unreachable.`);
        } else {
          setFeedback(
            `The server returned an unexpected HTML response instead of JSON (HTTP ${res.status} ${res.statusText || 'Error'}).`
          );
        }
        return;
      }

      // Parse JSON safely
      let data: { success?: boolean; error?: string; message?: string; configured?: boolean } = {};
      try {
        data = trimmedText ? JSON.parse(trimmedText) : {};
      } catch {
        setIsHtmlError(true);
        setStatus('error');
        setFeedback(
          `Unable to parse response as JSON (HTTP ${res.status}). Server returned an unexpected format.`
        );
        return;
      }

      if (!res.ok || !data.success) {
        if (data.configured === false) {
          setIsCredentialsMissing(true);
        }
        setStatus('error');
        let errorMsg = data.error || 'Failed to deliver message. Please try again.';

        // Also guard against error messages containing HTML snippets from third-party APIs
        if (typeof errorMsg === 'string' && (errorMsg.trim().startsWith('<') || errorMsg.includes('<html'))) {
          setIsHtmlError(true);
          errorMsg = `Email service responded with an unexpected error page (HTTP ${res.status}).`;
        }

        setFeedback(errorMsg);
        return;
      }

      setStatus('success');
      setFeedback(data.message || 'Message delivered successfully! Thank you for reaching out.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while transmitting message.';

      // Intercept any JSON parsing syntax errors (e.g. "Unexpected token '<', "<html><hea"... is not valid JSON")
      if (
        typeof msg === 'string' &&
        (msg.includes('is not valid JSON') ||
          msg.includes('Unexpected token') ||
          msg.includes('JSON.parse'))
      ) {
        setIsHtmlError(true);
        setFeedback('The server returned an unexpected HTML error page instead of JSON. The service may be restarting or temporarily unconfigured.');
      } else {
        setFeedback(msg);
      }
      setStatus('error');
    }
  };

  const handleMailtoFallback = () => {
    const subject = formData.subject || 'Project inquiry';
    const body = `From: ${formData.name} <${formData.email}>\n\n${formData.message}`;
    window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-primary-text flex flex-col justify-between relative">
      {/* Subtle CAD grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-25 pointer-events-none" />

      <Navbar />

      <main className="pt-36 md:pt-44 flex-1 relative z-10">
        <Container>
          <div className="grid gap-16 pb-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            {/* Left Column: Direct info & links */}
            <div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-[2px] bg-accent" />
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent font-semibold">
                  Contact / 01
                </p>
              </div>
              <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-8xl">
                Let&apos;s make the next thing{' '}
                <span className="font-serif font-light italic text-accent-secondary">useful.</span>
              </h1>
              <p className="mt-8 max-w-md text-base leading-8 text-muted-text font-sans">
                Have a product to shape, a system to untangle, or a frontend that needs more care? Send
                a note and I&apos;ll get back to you with a thoughtful next step.
              </p>

              <div className="mt-8">
                <Chip variant="accent" size="sm">
                  Available for new contracts
                </Chip>
              </div>

              <div className="mt-10 space-y-5 border-t border-white/10 pt-7">
                {revealedContact === 'email' ? (
                  <a
                    id="contact-email-revealed"
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-4 text-sm text-muted-text transition hover:text-accent font-mono"
                  >
                    <Mail className="h-4 w-4 text-accent" /> {personalInfo.email}
                  </a>
                ) : (
                  <span
                    id="contact-email-masked"
                    role="button"
                    tabIndex={0}
                    title="Click to reveal"
                    aria-label="Click to reveal email address"
                    onClick={() => revealContact('email')}
                    onKeyDown={(event) => handleContactKeyDown(event, 'email')}
                    className="flex cursor-pointer items-center gap-4 text-sm text-muted-text transition hover:text-accent font-mono"
                  >
                    <Mail className="h-4 w-4 text-accent" /> k******dev@gmail.com
                    <span className="text-[10px] text-accent/70 font-sans underline">(click to reveal)</span>
                  </span>
                )}

                {revealedContact === 'phone' ? (
                  <a
                    id="contact-phone-revealed"
                    href={`tel:${personalInfo.phone}`}
                    className="flex items-center gap-4 text-sm text-muted-text transition hover:text-accent font-mono"
                  >
                    <Phone className="h-4 w-4 text-accent" /> {personalInfo.phone}
                  </a>
                ) : (
                  <span
                    id="contact-phone-masked"
                    role="button"
                    tabIndex={0}
                    title="Click to reveal"
                    aria-label="Click to reveal phone number"
                    onClick={() => revealContact('phone')}
                    onKeyDown={(event) => handleContactKeyDown(event, 'phone')}
                    className="flex cursor-pointer items-center gap-4 text-sm text-muted-text transition hover:text-accent font-mono"
                  >
                    <Phone className="h-4 w-4 text-accent" /> +8801612-*****
                    <span className="text-[10px] text-accent/70 font-sans underline">(click to reveal)</span>
                  </span>
                )}

                <div id="contact-location" className="flex items-center gap-4 text-sm text-muted-text font-mono">
                  <MapPin className="h-4 w-4 text-accent" /> {personalInfo.location}
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <a
                  id="contact-github-link"
                  aria-label="GitHub"
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-[8px_2px_8px_2px] border border-white/12 bg-[#141820] flex items-center justify-center text-muted-text hover:text-accent hover:border-accent transition-all active:scale-95 shadow-sm"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  id="contact-linkedin-link"
                  aria-label="LinkedIn"
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-[8px_2px_8px_2px] border border-white/12 bg-[#141820] flex items-center justify-center text-muted-text hover:text-accent hover:border-accent transition-all active:scale-95 shadow-sm"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  id="contact-website-link"
                  aria-label="Website"
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-[8px_2px_8px_2px] border border-white/12 bg-[#141820] flex items-center justify-center text-muted-text hover:text-accent hover:border-accent transition-all active:scale-95 shadow-sm"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="relative">
              <div
                id="contact-form-container"
                className="relative border border-white/12 bg-[#0E1218] p-6 sm:p-10 rounded-[24px_6px_24px_6px] shadow-2xl backdrop-blur-sm"
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                        Project brief
                      </p>
                      <p className="mt-2 text-sm text-muted-text font-sans">
                        Share a few details about your project, timeline, or goals, and I&apos;ll get back to you shortly.
                      </p>
                    </div>
                    <Send className="h-5 w-5 text-white/20" />
                  </div>

                  {status === 'error' && (
                    <div
                      id="contact-error-alert"
                      className="mb-8 p-5 rounded-[14px_3px_14px_3px] bg-red-500/10 border border-red-500/25 text-xs space-y-3.5"
                    >
                      <div className="flex items-start gap-2.5 text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="leading-relaxed font-mono font-medium">{feedback}</div>
                      </div>

                      {isHtmlError && (
                        <div className="pt-2 border-t border-red-500/15 text-muted-text text-xs leading-relaxed font-sans">
                          This typically occurs when a cloud proxy, gateway (502/504), or server error page responds with an HTML document rather than a JSON API response. Your drafted text has been preserved below.
                        </div>
                      )}

                      {isCredentialsMissing && (
                        <div className="pt-2 border-t border-red-500/15 text-muted-text space-y-2 font-sans">
                          <p className="text-xs">
                            You can configure your credentials in <code className="text-accent bg-white/5 px-1 py-0.5 rounded font-mono">EMAILJS_SERVICE_ID</code>, <code className="text-accent bg-white/5 px-1 py-0.5 rounded font-mono">EMAILJS_TEMPLATE_ID</code>, and <code className="text-accent bg-white/5 px-1 py-0.5 rounded font-mono">EMAILJS_PUBLIC_KEY</code>.
                          </p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-red-500/15 flex flex-wrap items-center gap-4 font-sans">
                        <button
                          id="contact-mailto-fallback-btn"
                          type="button"
                          onClick={handleMailtoFallback}
                          className="inline-flex items-center gap-1.5 text-xs text-white font-mono uppercase tracking-wider underline hover:text-accent transition-colors cursor-pointer"
                        >
                          Send via default email app instead <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id="contact-retry-btn"
                          type="button"
                          onClick={() => {
                            setStatus('idle');
                            setFeedback('');
                            setIsHtmlError(false);
                            setIsCredentialsMissing(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-mono uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Dismiss &amp; Retry
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text">
                        Your name *
                      </span>
                      <input
                        id="contact-name-input"
                        required
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-accent"
                        placeholder="Jane Smith"
                      />
                    </label>

                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text">
                        Email *
                      </span>
                      <input
                        id="contact-email-input"
                        required
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-accent"
                        placeholder="jane@company.com"
                      />
                    </label>
                  </div>

                  <label className="mt-8 block">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text">
                      Subject
                    </span>
                    <input
                      id="contact-subject-input"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-accent"
                      placeholder="A new product experience"
                    />
                  </label>

                  <label className="mt-8 block">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text">
                      Message *
                    </span>
                    <textarea
                      id="contact-message-input"
                      required
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-3 w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 text-sm leading-7 outline-none transition placeholder:text-white/20 focus:border-accent"
                      placeholder="Tell me what you are building..."
                    />
                  </label>

                  <div className="mt-9 flex flex-wrap items-center gap-5">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={status === 'loading'}
                      className={`inline-flex items-center gap-2 rounded-[12px_3px_12px_3px] px-6 py-3.5 text-[11px] font-mono font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-md ${
                        status === 'loading'
                          ? 'bg-white/20 text-white/50 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-accent-secondary'
                      }`}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>

                    {status === 'idle' && (
                      <span className="text-[11px] font-mono text-muted-text">
                        Typically responds within 24 hours
                      </span>
                    )}
                  </div>

                  {status === 'success' && (
                    <div
                      id="contact-success-message"
                      className="mt-6 flex items-center gap-3 rounded-[14px_3px_14px_3px] border border-emerald-500/25 bg-emerald-500/10 p-4 font-mono text-xs text-emerald-400"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span className="leading-relaxed">
                        {feedback || 'Message delivered successfully! Thank you for reaching out.'}
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
