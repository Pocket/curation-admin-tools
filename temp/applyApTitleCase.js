"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyApTitleCase = exports.lowercaseAfterApostrophe = exports.stop = exports.SEPARATORS = exports.STOP_WORDS = void 0;
exports.STOP_WORDS = 'a an and as at but by for if in nor of off on or out so the to yet';
// Matches a colon (:) and 0+ white spaces following after
// Matches 1+ white spaces
// Matches special chars (i.e. hyphens, quotes, etc)
exports.SEPARATORS = /(:\s*|\s+|[-‑–—,:;!?()“”'‘"])/; // Include curly quotes as separators
exports.stop = exports.STOP_WORDS.split(' ');
/**
 * Format a string: Match the letter after an apostrophe & capture the apostrophe and matched char.
 * Lowercase the captured letter & return the formatted string.
 * Exception: O' prefix (like O'Hearn) should have the letter after apostrophe capitalized.
 * @param input
 * @returns {string}
 */
const lowercaseAfterApostrophe = (input) => {
    // Match either an ASCII or curly apostrophe followed by a letter, after a word character.
    // Negative lookbehind to exclude O' prefix
    const regex = /(?<!^O)(?<![\s]O)(?<=\w)(['\u2018\u2019])(\w)/g;
    return input.replace(regex, (_, apostrophe, letter) => `${apostrophe}${letter.toLowerCase()}`);
};
exports.lowercaseAfterApostrophe = lowercaseAfterApostrophe;
/**
 * Capitalize first character for string
 *
 * @param {string} value
 * @returns {string}
 */
const capitalize = (value) => {
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
const applyApTitleCase = (value) => {
    if (!value) {
        return '';
    }
    // Split and filter empty strings
    // Boolean here acts as a callback, evaluates each word:
    // If it's a non-empty string, keep the word in the array;
    // If it's an empty string (or falsy), remove from array.
    const allWords = value.split(exports.SEPARATORS).filter(Boolean); // Split and filter empty strings
    const result = allWords
        .map((word, index, all) => {
        const isAfterColon = index > 0 && all[index - 1].trim() === ':';
        const isAfterQuote = index > 0 &&
            (allWords[index - 1] === "'" ||
                allWords[index - 1] === '"' ||
                allWords[index - 1] === '\u2018' || // Opening single quote '
                allWords[index - 1] === '\u201C'); // Opening double quote "
        if (index === 0 || // first word
            index === all.length - 1 || // last word
            isAfterColon || // capitalize the first word after a colon
            isAfterQuote || // capitalize the first word after a quote
            !exports.stop.includes(word.toLowerCase()) // not a stop word
        ) {
            return capitalize(word);
        }
        return word.toLowerCase();
    })
        .join(''); // join without additional spaces
    // Apply special formatting rules
    let formattedResult = (0, exports.lowercaseAfterApostrophe)(result);
    // Handle special cases like iPhone, iPad, iPod, etc.
    // This regex looks for word boundaries followed by capital I and then Phone/Pad/Pod/etc.
    formattedResult = formattedResult.replace(/\bI(Phone|Pad|Pod|Mac|Cloud|Tunes|Books|Message)/g, 'i$1');
    return formattedResult;
};
exports.applyApTitleCase = applyApTitleCase;
