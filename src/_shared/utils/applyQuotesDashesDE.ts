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
    .replace(/(^|[-\u2014/([{\u2018\s])\u00BB/g, '$1\u201E') // Replaces opening » with „
    .replace(/\u00BB/g, '\u201D') // Replaces closing » with ”
    .replace(/\u00AB/g, '\u201D') // Replaces closing « with ”
    .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201E') // Opening doubles (replaces opening " with „)
    .replace(/"/g, '\u201D') // Closing doubles (replaces closing " with ”)
    .replace(/(^|[-\u2014/([{\u2018\s])\u201c/g, '$1\u201E') // Replaces opening “ with „
    .replace(/\s\u2014\s/g, ' \u2013 ') // Replace em dash (—) with en dash (–)
    .replace(/\s-\s/g, ' \u2013 '); // Replace short dash (-) with long en dash (–)

};
