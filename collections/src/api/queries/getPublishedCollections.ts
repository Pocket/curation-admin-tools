import { gql } from '@apollo/client';
import { CollectionAuthors } from '../fragments/CollectionAuthors';

/**
 * Get a list of published collections
 */
export const getPublishedCollections = gql`
  query getPublishedCollections {
    searchCollections(filters: { status: PUBLISHED }) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        ...CollectionAuthors
        stories {
          title
        }
      }
    }
  }
  ${CollectionAuthors}
`;
