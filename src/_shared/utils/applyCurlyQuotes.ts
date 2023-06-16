/**
 * Helper to replace opening and closing curly single and double quotes
 * adapted from https://gist.github.com/drdrang/705071
 *
 * @param text
 * @returns {string}
 */

export const applyCurlyQuotes = (text: string): string => {
  if (!text) {
    return '';
  }
  return text
    .replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018') // Opening singles
    .replace(/'/g, '\u2019') // Closing singles & apostrophes
    .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201c') // Opening doubles
    .replace(/"/g, '\u201d'); // Closing doubles
};
