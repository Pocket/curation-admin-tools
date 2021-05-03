import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get a list of draft collections
 */
export const getDraftCollections = gql`
  query getDraftCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: DRAFT }
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
  ${AuthorData}
`;
