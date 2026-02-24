import { CorpusItemAuthor } from '../../api/generatedTypes';

/**
 * A helper function that takes in an array of corpus item authors
 * and returns a comma-separated list suitable for displaying to end users.
 *
 * @param authors
 */
export const flattenAuthors = (authors: CorpusItemAuthor[]): string => {
  return authors
    .map((author: CorpusItemAuthor) => {
      return author.name;
    })
    .join(', ');
};
