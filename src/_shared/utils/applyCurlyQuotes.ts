/**
 * Helper to replace opening and closing curly single and double quotes
 *
 * @param text
 * @returns {string}
 */

export const applyCurlyQuotes = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/'\b/g, '\u2018') // Opening singles
    .replace(/\b'/g, '\u2019') // Closing singles
    .replace(/"\b/g, '\u201c') // Opening doubles
    .replace(/\b"/g, '\u201d'); // Closing doubles
};
