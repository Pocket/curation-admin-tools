interface StoryAuthor {
  name: string;
  sortOrder: number;
}

/**
 * A helper function that transforms a comma-separated string of names
 * into an array of StoryAuthor objects.
 *
 * @param authors
 */
export const transformAuthors = (authors: string): StoryAuthor[] => {
  // get rid of any whitespace on the sides
  authors = authors.trim();

  // ensure authors isn't an empty string
  if (authors) {
    return authors.split(',').map((name: string, sortOrder: number) => {
      return { name: name.trim(), sortOrder };
    });
  } else {
    // if authors *is* an empty string, just return an empty array
    return [];
  }
};
