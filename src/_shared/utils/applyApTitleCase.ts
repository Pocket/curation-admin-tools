/**
 * AP Style Title Case Implementation
 * Follows Associated Press style guide for headline capitalization
 * Reference: https://headlinecapitalization.com/
 */

// Words that should remain lowercase unless they start/end the title or follow a colon
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'if',
  'in',
  'nor',
  'of',
  'off',
  'on',
  'or',
  'out',
  'so',
  'the',
  'to',
  'vs',
  'yet',
]);

// Regex to split text while preserving separators (punctuation, spaces, etc.)
const SEPARATORS = /(:\s*|\s+|[-‑–—,:;!?()"'\u201C\u201D\u2018\u2019])/;

// Quote characters that trigger capitalization of the following word
const QUOTES = new Set(['"', "'", '\u2018', '\u201C']);

// Pattern to lowercase letters after apostrophes (except Irish names like O'Brien)
// Handles both ASCII and Unicode apostrophes
const APOSTROPHES = /(?<!^O)(?<!\sO)(?<=\w)(['\u2018\u2019])(\w)/g;

// Apple product names that should maintain lowercase 'i' prefix
const APPLE_PRODUCTS = /\bI(Phone|Pad|Pod|Mac|Cloud|Tunes|Books|Message)/g;

/**
 * Capitalizes the first character of a string
 */
const capitalize = (str: string): string =>
  str && str[0].toUpperCase() + str.slice(1);

/**
 * Determines if a word should be capitalized based on AP style rules
 *
 * Rules:
 * 1.First and last words are always capitalized
 * 2. Words after colons are capitalized
 * 3. Words after opening quotes are capitalized
 * 4. Stop words remain lowercase (unless rules 1-3 apply)
 */
const shouldCapitalize = (
  word: string,
  index: number,
  words: string[],
): boolean => {
  // Always capitalize first and last words
  if (index === 0 || index === words.length - 1) return true;

  const prevWord = words[index - 1];
  // Capitalize after colons and opening quotes
  if (prevWord.trim() === ':' || QUOTES.has(prevWord)) return true;

  // Stop words remain lowercase
  return !STOP_WORDS.has(word.toLowerCase());
};

/**
 * Applies AP style title case to a string
 *
 * @param value - The string to transform
 * @returns Title-cased string following AP style guide
 *
 * @example
 * applyApTitleCase("the quick brown fox jumps over the lazy dog")
 * // Returns: "The Quick Brown Fox Jumps Over the Lazy Dog"
 *
 * @example
 * applyApTitleCase("iPhone users: here's what you need to know")
 * // Returns: "iPhone Users: Here's What You Need to Know"
 */
export const applyApTitleCase = (value: string): string => {
  if (!value) return '';

  // Split into words while preserving all separators
  const words = value.split(SEPARATORS).filter(Boolean);

  // Apply title case rules to each word
  const titleCased = words
    .map((word, i) =>
      shouldCapitalize(word, i, words) ? capitalize(word) : word.toLowerCase(),
    )
    .join('');

  // Post-processing: handle special cases
  return titleCased
    .replace(APOSTROPHES, (_, apos, letter) => `${apos}${letter.toLowerCase()}`)
    .replace(APPLE_PRODUCTS, 'i$1');
};
