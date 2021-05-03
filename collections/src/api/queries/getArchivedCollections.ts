import { gql } from '@apollo/client';
import { CollectionAuthors } from '../fragments/CollectionAuthors';

/**
 * Get a list of archived collections
 */
export const getArchivedCollections = gql`
  query getArchivedCollections {
    searchCollections(filters: { status: ARCHIVED }) {
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
