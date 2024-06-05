/**
 * Helper to replace opening and closing quotes, arrow brackets (» «) for German
 * Quotes represented in unicode
 *
 * @param text
 * @returns string
 */

export const applyQuotesDashesDE = (text: string): string | undefined => {
  if (!text) {
    return undefined;
  }
  return text
    .replace(/(^|[-\u2014/([{\u2018\s])\u00AB/g, '$1\u201E') // Replaces opening « with „
    .replace(/\u00BB/g, '\u201D') // Replaces closing » with ”
    .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201E') // Opening doubles (replaces opening " with „)
    .replace(/"/g, '\u201D') // Closing doubles (replaces closing " with ”)
    .replace(/(^|[-\u2014/([{\u2018\s])\u201c/g, '$1\u201E') // Replaces opening “ with „
    .replace(/\s\u2013\s/g, ' \u2014 ') // Replace en dash (–) with long em dash (—)
    .replace(/\s-\s/g, ' \u2014 '); // Replace short dash (-) with long em dash (—)
};
