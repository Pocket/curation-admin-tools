import {
  CollectionAuthor,
  CollectionStoryAuthor,
  CorpusItemAuthor,
} from '../../api/generatedTypes';

/**
 * A helper function that takes in an array of corpus/collection [story] authors
 * and returns a comma-separated list suitable for displaying to end users.
 *
 * @param authors
 */
export const flattenAuthors = (
  authors: CollectionStoryAuthor[] | CollectionAuthor[] | CorpusItemAuthor[]
): string => {
  return authors
    .map(
      (author: CollectionStoryAuthor | CollectionAuthor | CorpusItemAuthor) => {
        return author.name;
      }
    )
    .join(', ');
};
