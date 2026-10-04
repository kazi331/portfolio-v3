/**
 * Turns an arbitrary title (which may contain em dashes, slashes, etc.)
 * into a safe PDF filename, e.g.
 * "Full Stack Developer — Node.js / Next.js" -> "Full_Stack_Developer_Node_js_Next_js_Resume.pdf"
 */
export function slugifyFilename(
  text: string | undefined | null,
  suffix = "_Resume.pdf",
  fallback = "Resume",
): string {
  const base = text || fallback;
  // Anything that isn't a letter, digit, underscore, space or hyphen becomes a space.
  const cleaned = base
    .replace(/[^\p{L}\p{N}_\s-]/gu, " ")
    .replace(/[\s-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${cleaned || fallback}${suffix}`;
}

/** "https://www.example.com/x" -> "example.com" */
export function linkLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
