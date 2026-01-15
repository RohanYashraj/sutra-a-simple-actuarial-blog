export function sanitizeSlug(text: string): string {
  return text
    .replace(/[^a-zA-Z\s]/g, '') // Ignore non-alphabetic characters
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with "-"
    .toLowerCase();
}
