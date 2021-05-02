import { gql } from '@apollo/client';

/**
 * Data on collection authors
 */
export const CollectionAuthors = gql`
  fragment CollectionAuthors on Collection {
    authors {
      externalId
      name
      slug
      bio
      imageUrl
      active
    }
  }
`;
