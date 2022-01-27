import {
  CollectionAuthor,
  CollectionStoryAuthor,
} from '../../api/generatedTypes';

/**
 * A helper function that takes in an array of collection [story] authors
 * and returns a comma-separated list suitable for displaying to end users.
 *
 * @param authors
 */
export const flattenAuthors = (
  authors: CollectionStoryAuthor[] | CollectionAuthor[]
): string => {
  let displayAuthors = '';

  if (authors.length > 0) {
    displayAuthors = authors
      .map((author: CollectionStoryAuthor | CollectionAuthor) => {
        return author.name;
      })
      .join(', ');
  }

  return displayAuthors;
};
