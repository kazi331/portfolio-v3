/**
 * Helper utilities for generating slugs and computing reading times
 */

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // replace accented characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // replace non-alphanumeric chars with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // collapse whitespace and hyphens
    .replace(/[\s-]+/g, '-')
    // trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

export function calculateReadTime(content: string): string {
  if (!content || !content.trim()) return '1 min read';
  
  // Strip markdown formatting characters to estimate actual words
  const cleanText = content
    .replace(/```[\s\S]*?```/g, '') // strip code blocks
    .replace(/`.*?`/g, '') // strip inline code
    .replace(/#+\s/g, '') // strip headers
    .replace(/\[.*?\]\(.*?\)/g, '') // strip links
    .replace(/[*_~>]/g, ' ') // strip formatting symbols
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${Math.max(1, minutes)} min read`;
}
