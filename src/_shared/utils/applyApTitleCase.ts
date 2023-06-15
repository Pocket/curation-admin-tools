export const STOP_WORDS =
  'a an and at but by for in nor of on or so the to up yet';

export const SEPARATORS = /(\s+|[-‑–—,:;!?()])/;

/**
 * Capitalize first character for string
 *
 * @param {string} value
 * @returns {string}
 */
const capitalize = (value: string) => {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Helper to convert text to AP title case
 * adapted from https://github.com/words/ap-style-title-case
 * text should match https://headlinecapitalization.com/
 *
 * @param {string} [value]
 * @returns {string}
 */
export const applyApTitleCase = (value: string): string => {
  if (!value) {
    return '';
  }
  // split by separators, check if word is first or last
  // or not blacklisted, then capitalize
  const stop = STOP_WORDS.split(' ');
  return value
    .split(SEPARATORS)
    .map((word, index, all) => {
      if (
        index === 0 ||
        index === all.length - 1 ||
        !stop.includes(word.toLowerCase())
      ) {
        return capitalize(word);
      }
      return word.toLowerCase();
    })
    .join('');
};
