import {
  CollectionAuthor,
  CollectionStoryAuthor,
  CorpusItemAuthor,
  Maybe,
} from '../../api/generatedTypes';

/**
 * A helper function that takes in an array of corpus/collection [story] authors
 * and returns a comma-separated list suitable for displaying to end users.
 *
 * @param authors
 */
export const flattenAuthors = (
  authors:
    | CollectionStoryAuthor[]
    | CollectionAuthor[]
    // Sometimes there are no authors for a Corpus Item, especially one coming from backfill,
    // so the following two types cater for that
    | Maybe<CorpusItemAuthor[]>
    | undefined
): string => {
  let displayAuthors = '';

  if (authors && authors.length > 0) {
    displayAuthors = authors
      .map(
        (
          author: CollectionStoryAuthor | CollectionAuthor | CorpusItemAuthor
        ) => {
          return author.name;
        }
      )
      .join(', ');
  }

  return displayAuthors;
};
