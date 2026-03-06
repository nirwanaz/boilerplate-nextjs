/**
 * Slug generation utilities
 * Generate SEO-friendly URL slugs from text
 */

/**
 * Generate a slug from text
 * @param text - The text to convert to a slug
 * @returns SEO-friendly slug
 * @example generateSlug("My First Article!") // "my-first-article"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Ensure slug is unique by appending a number if needed
 * @param baseSlug - The base slug to check
 * @param existingCheck - Function that returns true if slug exists
 * @returns Unique slug
 * @example ensureUniqueSlug("my-article", checkExists) // "my-article-1" if exists
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  existingCheck: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await existingCheck(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Extract excerpt from HTML content
 * @param html - HTML content
 * @param maxLength - Maximum length of excerpt (default: 200)
 * @returns Plain text excerpt
 */
export function extractExcerpt(html: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Trim and limit length
  if (text.length <= maxLength) {
    return text.trim();
  }
  
  // Cut at word boundary
  const trimmed = text.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}
