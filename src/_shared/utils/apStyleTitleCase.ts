export const STOP_WORDS =
  'a an and at but by for in nor of on or so the to up yet';

export const SEPARATORS = /(\s+|[-‑–—,:;!?()])/;

/**
 *
 * @param {string} value
 * @returns {string}
 */
const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Convert a value to AP/APA title case.
 * adapted from https://github.com/words/ap-style-title-case
 *
 * @param {string} [value]
 *   Short text of unknown casing.
 * @returns {string}
 *   Title-cased version of `value`.
 */
export const applyApTitleCase = (value: string): string => {
  if (!value) return '';

  const stop = STOP_WORDS.split(' ');

  // first split by separators, check if word is first or last or should be added
  // then capitalize otherwise ignore
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
