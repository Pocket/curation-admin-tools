import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get a list of published collections
 */
export const getPublishedCollections = gql`
  query getPublishedCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: PUBLISHED }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorData}
`;
