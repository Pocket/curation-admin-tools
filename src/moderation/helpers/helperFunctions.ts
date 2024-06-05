/**
 * Helper function; replaces multiple chars in a string
 * @param str
 * @param charsToFindArr
 * @param replaceWithCharsArr
 */
export const replaceCharsInStr = (
  str: string,
  charsToFindArr: string[],
  replaceWithCharsArr: string[],
) => {
  for (let i = 0; i < charsToFindArr.length; i++) {
    const regex = new RegExp(charsToFindArr[i], 'g');
    str = str.replace(regex, replaceWithCharsArr[i]);
  }
  return str;
};
